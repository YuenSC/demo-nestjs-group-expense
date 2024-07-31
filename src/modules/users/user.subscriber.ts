import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { FileUploadService } from '../file-upload/file-upload.service';
import { User } from './entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    private readonly fileUploadService: FileUploadService,
    dataSource: DataSource,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async afterLoad(entity: User) {
    if (entity.imageKey) {
      const { url } = await this.fileUploadService.getPresignedSignedUrl(
        entity.imageKey,
      );
      entity.imageUrl = url;
    }
  }
}
