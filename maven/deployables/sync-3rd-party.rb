#!/usr/bin/env ruby

# Ad hoc script for putting caAERS' dependencies in a maven repository.  Metadata is read from 
# "3rd-party-maven-jars.tsv", which must be in the same directory as the script.
#
# Checks the SHA1 digest of the installed/deployed file and skips it if
# the local version is the same.  This requires openssl(1).
#
# For usage:
#   $ ./sync-3rd-party.rb -h
#
# Modes:
#   install - Install jars into your local maven repo.  Assumed to be at ~/.m2/repository (the default).
#   deploy  - Deploy jars to the NU bioinformatics public maven2 repo.  Requires an account on that
#             machine, configured in your local settings.xml.

require 'csv'
require 'open-uri'
require 'optparse'
require 'fileutils'
include FileUtils
require 'rexml/document'
include REXML

def sync(modeclass, options)
  sync_jars(modeclass, options) if options[:jars]
  sync_poms(modeclass, options) if options[:poms]
end

def sync_jars(modeclass, options)
  data = open('3rd-party-maven-jars.tsv', 'r')
  data.readline # skip

  files = []
  CSV::Reader.parse(data, "\t") do |row|
    group, artifact, version_s, classifier, file = row
    version = version_s.nil? ? '1.0-SNAPSHOT' : version_s
    
    raise "Multiple rows for same jar: #{file}" if files.include? file
    files << file
    
    modeclass.new(group, artifact, version, classifier, file, "jar", options).go
  end
end

def sync_poms(modeclass, options)
  Dir["pom/*.xml"].each do |pomFile|
    doc = Document.new(File.new(pomFile))
    project = doc.elements["project"]
    group = project.elements["groupId"].text
    artifact = project.elements["artifactId"].text
    version = project.elements["version"].text
    
    modeclass.new(group, artifact, version, nil, File.basename(pomFile), "pom", options).go
  end
end

class Mode
  attr_accessor :group, :artifact, :version, :classifier, :file, :packaging
  attr_reader :options
  
  def initialize(group, artifact, version, classifier, file, packaging, options)
    $stderr.puts "Missing group" unless group
    $stderr.puts "Missing artifact" unless artifact
    $stderr.puts "Missing filename for #{group}:#{artifact}" unless file

    self.group = group
    self.artifact = artifact
    self.version = version
    self.classifier = classifier
    self.packaging = packaging
    self.file = "#{packaging}/#{file}"
    @options = options
  end
  
  def go
    log "----- #{group}:#{artifact}"
    unless uptodate?
      execute
      log "-----"
    else
      log "----- already #{self.class.to_s.downcase}ed"
    end
    log ""
  end
  
  def uptodate?
    log "  remote: #{remote_sha1}\n  local:  #{local_sha1}"
    remote_sha1 == local_sha1
  end
  
  def local_sha1
    return nil unless file_exists?
    @file_sha1 ||= digest(file)
  end
  
  def log(msg, level=:verbose)
    stream = $stdout
    # use stdout for commands only if pretending 
    # -- makes it easier to capture for replay elsewhere
    if options[:pretend] and not level == :pretend
      stream = $stderr
    end
    stream.puts msg if level != :verbose or options[:verbose]
  end
  
  def execute(pretend=true)
    return unless file_exists?

    c = command
    log c, :pretend
    unless options[:pretend]
      v = `#{c}`
      log v, :always
    end
  end
  
  protected

  def command
    sysprops = command_sysprops.collect { |prop, value| "-D#{prop}=#{value}" }.join(" ")
    flags = options[:debug] ? "-X" : nil
    args = [flags, goal, sysprops].select { |x| not x.nil? }.join(" ")
    "mvn #{args}"
  end
  
  def command_sysprops
    props = {
      :groupId => group,
      :artifactId => artifact,
      :version => version,
      :file => file,
      :packaging => packaging
    }
    props[:pomFile] = file if packaging == "pom"
    props[:classifier] = classifier unless classifier.nil?
    props
  end

  def relative_dir
    group_dir = group.gsub(".", "/")
    "#{group_dir}/#{artifact}/#{version}"
  end
  
  def artifact_name(v=@version)
    n = "#{artifact}-#{v}"
    n += "-#{classifier}" if classifier
    n
  end
  
  def digest(local_file)
    return nil unless File.exists? local_file
    c = "openssl sha1 #{local_file}"
    log "  `#{c}`"
    `#{c}`.split(/\s+/)[1].strip
  end
  
  def file_exists?
    return @file_exists unless @file_exists.nil?
    @file_exists = begin
      ex = File.exists? file
      log "#{file} not found (wd: #{pwd})", :error unless ex
      ex
    end
  end
end

class Install < Mode
  protected
  
  def remote_sha1
    @remote_sha1 ||= digest("#{directory}/#{filename}")
  end
  
  def goal
    "install:install-file"
  end
  
  def directory
    "#{ENV['HOME']}/.m2/repository/#{relative_dir}"
  end
  
  def filename
    fn = "#{artifact_name}.#{packaging}"
  end
end

class Deploy < Mode
  REPOSITORY_ID = "download.bioinformatics"
  URL = "scp://download.bioinformatics.northwestern.edu/var/www/html/download/maven2"

  def remote_sha1
    @remote_sha1 ||= begin
      log "  open(#{repo_url})"
      s = ''
      open(repo_url) do |f|
        matches = f.read.scan(pattern).uniq
        return nil if matches.size == 0 # file not present
        sha1_url = "#{repo_url}/#{current(matches)}.sha1"
        log "  open(#{sha1_url})"
        s = open(sha1_url).read.strip
      end
      s
    rescue OpenURI::HTTPError => e
      log "  #{e}"
      if e.io.status[0] == "404"
        '' # a 404 means the directory doesn't exist, so we should deploy
      else
        raise e
      end
    end
  end
  
  def current(matches)
    return matches[0] unless snapshot? 
    return matches[0][0] if matches.size == 1
    # sort by the build number, then return the matching snapshot name
    matches.sort { |x, y| y[1].to_i <=> x[1].to_i }[0][0]
  end
  
  def command_sysprops
    super.merge({
      :repositoryId => REPOSITORY_ID,
      :url => URL
    })
  end
  
  private
  
  def goal
    "deploy:deploy-file"
  end
  
  def repo_url
    group_dir = group.gsub(".", "/")
    "http://download.bioinformatics.northwestern.edu/maven2/#{relative_dir}"
  end
  
  def snapshot?
    version =~ /-SNAPSHOT/
  end
  
  def pattern
    if snapshot?; snapshot_pattern; else released_pattern; end
  end
  
  def released_pattern
    /#{artifact_name}.#{packaging}/
  end
  
  def snapshot_pattern
    version_number = version.gsub("-SNAPSHOT", "")
    /(#{artifact_name(version_number)}-\d{8}.\d{6}-(\d+).#{packaging})/
  end
end

# Script

options = { # defaults:
  :verbose => false, :pretend => false, 
  :poms => true, :jars => true, 
  :debug => false 
}
OptionParser.new do |opts|
  opts.banner = "#{File.basename($0)} [options] [install|deploy]"
  opts.on("-v", "--[no-]verbose", "Give details about what's going on") do |v|
    options[:verbose] = v
  end
  
  opts.on("-p", "--[no-]pretend", "Don't actually do anything -- just print what would be done") do |p|
    options[:pretend] = p
  end
  
  opts.on("--[no-]pom", "Include poms when running (default: true)") do |p|
    options[:poms] = p
  end
  
  opts.on("--[no-]jar", "Include jars when running (default: true)") do |p|
    options[:jars] = p
  end
  
  opts.on("-X", "--[no-]debug", "Pass the debug flag (-X) to maven") do |p|
    options[:debug] = p
  end
  
  opts.on_tail("-h", "--help", "Show this message") do
    puts opts
    exit
  end
end.parse!

cd File.dirname($0)
mode = ARGV[0] || "install" # the switches are removed from ARGV by parse!
sync(eval(mode.capitalize), options)