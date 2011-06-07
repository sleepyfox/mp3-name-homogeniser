// requires
var fs = require('fs'),
	path = require('path');

// declarations
var i=0, 
	debug = false,
	currentPath = "", 
	match = "",
	ls = [],
	regexpResult = [], 
	renameFrom = "", 
	renameTo = "",
	totalRenamed = 0,
	regexpString;		
		
// Error processing on arguments
if (process.argv.length < 3 || process.argv.length > 4) {
	console.log('Wrong number of arguments %d, was expecting 3 or 4', process.argv.length);
	console.log('Usage: \n    node mp3rename.js path-to-mp3-folder regexp-string');
	return; 
}
if (!(currentPath = process.argv[2])) {
	console.log('3rd argument (file path) must be a valid string');
	return;
} 
if (!path.existsSync(currentPath)) {
	console.log('3rd argument (file path) must be a valid directory, was %s', currentPath);
	return;
}
if (!(match = process.argv[3])) {
	console.log('4th argument (regexp) must be a valid string');
	return;
}
if (!(regexpString = new RegExp(match))) {
	console.log('4th argument (regexp) must be valid, was %s', match);
	return;
}
// main
if (debug) {
	console.log('DEBUG=ON');
	console.log('matching %s', regexpString);
	console.log('Files in %s\n', currentPath);
}
ls = fs.readdirSync(currentPath);
if (!ls.length) {
	console.log('No files in directory %s', currentPath);
	return;
}

// loop over all files in our target directory
for (i = 0; i < ls.length; i++) {
	if (regexpResult = regexpString.exec(ls[i])) {
		renameFrom = path.join(currentPath, ls[i]);
		renameTo = path.join(currentPath, (regexpResult[1] + " " + regexpResult[2]));
		if (debug) {
  			console.log('mv %s %s', renameFrom, renameTo);
  		}
  		if (!debug) {
  			fs.renameSync(renameFrom, renameTo); 
  			totalRenamed++;
  		}
	} else { // regexp doesn't match
		if (debug) {
			console.log("%s doesn't match", ls[i]);
		}
	}
}
if (!debug) {
	console.log('Total number of files renamed=%d', totalRenamed);
}
