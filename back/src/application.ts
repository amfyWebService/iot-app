import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import fs from "fs";

export class BackApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    /*
     * Get the list of every files and dir on public dir
     * And redirect every route to the front "index.html" 
     * except routes starting with /api or files and dir name of public directory
     */
    const whiteList = fs.readdirSync(path.join(__dirname, '../public'));
    whiteList.push(...["api", "explorer", "openapi.json"]);
    const regexFront = new RegExp(`^\/(?!${whiteList.join('|')}).*`);
    // @ts-ignore
    this.mountExpressRouter(regexFront, function(req, res, next){
      res.sendfile(path.join(__dirname, '../public/index.html'));
    });

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
