npm pack
mv ./nestjs-business-component-1.0.0.tgz ./playground/test/node_modules

tar -xzvf ./playground/test/node_modules/nestjs-business-component-1.0.0.tgz -C ./playground/test/node_modules/

rm -rf ./playground/test/node_modules/nestjs-business-component
mv ./playground/test/node_modules/package ./playground/test/node_modules/nestjs-business-component