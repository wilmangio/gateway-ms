import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE, PRODUCT_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports:[
    NatsModule
    // ClientsModule.register([
    //   { 
    //     name: PRODUCT_SERVICE, 
    //     transport: Transport.TCP,
    //     options:{
    //       host: envs.hostProduct,
    //       port: envs.portProduct,
    //     } 
    //   },
    //   { 
    //     name: NATS_SERVICE, 
    //     transport: Transport.NATS,
    //     options:{
    //       servers: envs.natsServers
    //     } 
    //   },
    // ]),
  ]
})
export class ProductsModule {}
