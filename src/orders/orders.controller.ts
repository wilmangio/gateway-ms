import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config/services';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from './dto/pagination-order.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    // con esto puedo acceder al crud de orders
    @Inject(NATS_SERVICE) private readonly ordersClient: ClientProxy,

  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  async findAll(@Query() orderPaginationDto:OrderPaginationDto) {
    try {
      const orders = await firstValueFrom(
        this.ordersClient.send('findAllOrders', orderPaginationDto)
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }     
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
       this.ordersClient.send('findOneOrder', {id: id})
      );
     return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }


  @Get('status/:status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      return this.ordersClient.send('findAllOrders',{
        ...paginationDto,
        status: statusDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() statusDto: StatusDto,
  ){
    try {
      return this.ordersClient.send('changeOrderStatus',{
        id: id,
        status: statusDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }


}
