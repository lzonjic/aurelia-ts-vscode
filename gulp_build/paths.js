var clientSourceRoot = 'src/client/';
var clientOutputRoot = 'dist/public/';
var serverSourceRoot = 'src/server/';
var serverOutputRoot = 'dist/';

module.exports = {
  htmlSource: clientSourceRoot + '**/*.html',
  cssSource: [
      clientSourceRoot + '**/*.css'
  ],
  clientJsSource: clientSourceRoot + '**/*.js',
  clientTsSource: clientSourceRoot + '**/*.ts',
  serverTsSource: serverSourceRoot + '**/*.ts',
  dtsSource: [
    'typings/**/*.ts', 
    clientSourceRoot + 'jspm_packages/**/*.d.ts'
  ],
  clientSourceRoot: clientSourceRoot,
  clientOutputRoot: clientOutputRoot,
  serverSourceRoot: serverSourceRoot,
  serverOutputRoot: serverOutputRoot
}