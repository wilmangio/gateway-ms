import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { NATS_SERVICE, PRODUCT_SERVICE } from 'src/config/services';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    // con esto puedo acceder al crud de products
    @Inject(NATS_SERVICE) private readonly productsClient: ClientProxy,

  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto){
    return this.productsClient.send({cmd: 'create_product'}, createProductDto);
  }

  @Get()
  findAllProduct(@Query() pagination:PaginationDto){
    //se pone el servicio tal cual como esta en el microservicio
    return this.productsClient.send({cmd: 'find_all_product'}, pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: number){
    try {
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'find_one_product' }, { id: id })
      );

      return product;
    } catch (error) {
      //captura todos los errores RpcException
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number){
    return this.productsClient.send({cmd: 'delete_product'}, { id })
    .pipe(
      catchError( err => { throw new RpcException(err)}),
    );;
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto){
      return this.productsClient.send({cmd: 'update_product'}, { id, ...updateProductDto})
      .pipe(
        catchError( err => { throw new RpcException(err)}),
      );
  }

}
