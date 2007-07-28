#!/usr/bin/env ruby
#
# Creates examples Participant XML Files
#
# Use as follows : ruby ParticipantXmlLoader.rb > file.xml 
#
# @Author Krikor Krumlian

require 'csv'
def createParticipantXml()
    index = 0
    
    puts " <?xml version=\"1.0\" encoding=\"UTF-8\"?>
           <participants>"
  
    3000.times do
      
      index = index + 1
    
      pstart = 
      "<participant>
      "
      xml  = 
      " 
        <firstName>Ramo"+index.to_s+"</firstName> 
        <lastName>Fregis"+index.to_s+"</lastName>
        <maidenName></maidenName>
        <middleName></middleName>
        <dateOfBirth>2007-04-15</dateOfBirth>
        <gender>Unknown</gender>
        <race>Unknown</race>
        <ethnicity>Unknown</ethnicity> 
      "
          
      identifiers = 
      " <identifiers>
            <identifier>
                <type>Local Identifier</type>
                <value>132za3"+index.to_s+"</value>
                <source>Wake Forest Comprehensive Cancer Center</source>
                <primaryIndicator>true</primaryIndicator>
            </identifier>
        </identifiers>
      "
      assignments = 
      "<assignments>
            <assignment>
                  <studySite>
                    <study>
                        <identifiers>
                            <identifier>
                                <value>nci-091</value>
                            </identifier>
                        </identifiers>
                    </study>
                  </studySite>
            </assignment>
        </assignments>"
      
        pend = 
        "</participant>
        "
      
      puts pstart + xml + identifiers + assignments + pend
      
    end
    
    puts "</participants>"  
end

createParticipantXml()