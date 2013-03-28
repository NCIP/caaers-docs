#!/usr/bin/env ruby

require 'csv'

pom = <<HEADER
<!-- Meta-POM for cagrid.  Includes dependencies on all grid jars which caAERS uses.-->

<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <packaging>pom</packaging>
    <name>caGrid metadependency package</name>
    <groupId>gov.nih.nci.cabig.caaers.ext</groupId>
    <artifactId>cagrid-everything</artifactId>
    <version>1.0-SNAPSHOT</version>
    
    <dependencies>
HEADER

data = open('3rd-party-maven-jars.tsv', 'r')
data.readline # skip

artifacts = []
CSV::Reader.parse(data, "\t") do |row|
  group, artifact, version_s, classifier, file = row
  artifacts << artifact if group == "gov.nih.nci.cagrid"
end
artifacts.sort! { |a, b| a.downcase <=> b.downcase }

artifacts.each do |a|
  pom << "        <dependency>\n"
  pom << "            <groupId>gov.nih.nci.cagrid</groupId>\n"
  pom << "            <artifactId>#{a}</artifactId>\n"
  pom << "            <version>${project.version}</version>\n"
  pom << "        </dependency>\n"
end

pom << "    </dependencies>\n"
pom << "</project>\n"

open("pom/cagrid-everything.pom.xml", "w") { |f| f << pom }
