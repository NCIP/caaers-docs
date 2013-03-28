package gov.nih.nci.cabig.ctms.maven.jibx;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.project.MavenProject;
import org.apache.commons.io.DirectoryWalker;
import org.jibx.xsd2jibx.Generate;

import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.HashSet;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

/**
 * This plugin is a thin wrapper around the main class in
 * <a href="http://jibx.sourceforge.net/xsd2jibx/index.html">xsd2jibx.jar</a>.
 * <p>
 * Currently only supports the list of schemas and the -d option (output directory);
 * adding other option support should be trivial if needed.
 *
 * @goal generate
 * @phase generate-sources
 */
public class Xsd2jibxMojo extends AbstractMojo {
    /**
     * Base directory for the generated source
     * @parameter expression="${project.build.directory}/generate-sources/jibx"
     * @required
     */
    private File outputDirectory;

    /**
     * The schemas to generate from
     * @parameter
     * @required
     */
    private File[] schemas;

    /**
     * The enclosing project
     * @parameter expression="${project}"
     */
    private MavenProject project;

    public void execute() throws MojoExecutionException, MojoFailureException {
        getLog().info("Generating source from XSD(s) " + Arrays.asList(schemas));

        String[] args = createArguments();
        getLog().debug("Executing xsd2jibx with arguments " + Arrays.asList(args));
        Generate.main(args);

        getLog().debug("Adding " + outputDirectory + " to compile source path");
        project.addCompileSourceRoot(outputDirectory.getAbsolutePath());

        // find the binding.xml file and leave a pointer in the project
        project.getModel().addProperty("xsd2jibx.binding",
            new BindingFinder().find().getAbsolutePath());
    }

    private String[] createArguments() {
        List<String> args = new ArrayList<String>(2 + schemas.length);
        args.add("-d");
        args.add(outputDirectory.getAbsolutePath());
        for (File schema : schemas) {
            args.add(schema.getAbsolutePath());
        }
        return args.toArray(new String[0]);
    }

    private class BindingFinder extends DirectoryWalker {
        private File found;
        private static final String DESIRED_FILENAME = "binding.xml";

        public File find() throws MojoExecutionException, MojoFailureException {
            try {
                walk(outputDirectory, new HashSet());
            } catch (IOException e) {
                throw new MojoExecutionException("Exception when looking for " + DESIRED_FILENAME, e);
            }
            if (found == null) throw new MojoFailureException("Expected " + DESIRED_FILENAME + " not found");
            return found;
        }

        @Override
        protected void handleCancelled(
            File startDirectory, Collection results, CancelException cancel
        ) throws IOException {
            // it's cancelled, that's all
        }

        @Override
        protected void handleFile(File file, int depth, Collection results) throws IOException {
            if (DESIRED_FILENAME.equals(file.getName())) {
                found = file;
                throw new CancelException("Found it", file, depth);
            }
        }
    }
}
