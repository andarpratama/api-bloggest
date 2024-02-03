import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import typeOrmConfig from 'typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), UsersModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  async onModuleInit() {
    try {
      // Trigger the connection to the database
      await TypeOrmModule.forRootAsync({
        useFactory: () => typeOrmConfig,
      });
      this.logger.log('Connected to MySQL database');
    } catch (error) {
      console.error(error);
      this.logger.error('Error connecting to MySQL database:', error.message);
    }
  }
}