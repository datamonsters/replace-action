const core = require('@actions/core');

try {
  const files = core.getInput('files');
  const vars_string = core.getInput('replacements');
  var filenames = files.replace(' ', '').split(',')
  var vars = vars_string.replace(' ', '').split(',')
  console.log('files l:'+ filenames.length)
  for(var fi = 0; fi < filenames.length; fi++)
  {
    var filename = filenames[fi]
    var fs = require('fs')
    console.log('file1: '+ fi + ' '+filename)
    fs.readFile(filename, 'utf8', function (err,data) {
      if (err) {
        console.log(err);
      } else {
        var result = data
        console.log(data)
        for(var i = 0; i < vars.length; i++)
        {
          var kv = vars[i].split('=')
          var key = kv[0]
          var value = kv[1]
          var regx = new RegExp(key, 'g');
          result = result.replace(regx, value)
        }
        console.log('file2: '+filename)
        fs.writeFile(filename, result, 'utf8', function (err) {
          if (err) 
            console.log(err)
          else 
            console.log(result)
        });
      }
    });
  }
} catch (error) {
  core.setFailed(error.message);
}
