# Handwriting Generator

The title is self-explanatory. This application generates handwritten characters on a notebook page which you can save as an image.

### File structure

/public

	/alphabets - contains all the character images 

/src

	/components
	
		HandwritingGenerator - The central component which has all the main functionalities
	
		Header - application header

		NotSupported - a simple screen for the devices which are not supported

		PageArea - the mapping of a specific area of the page

	/data
	
		data - has all the static data such as character filenames, page length, etc

	/styles - scss styles

	/utils
		
		utils - utility functions to fetch the characters, set margin and size for them, save snapshot of the page, etc
