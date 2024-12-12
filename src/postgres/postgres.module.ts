import { Module } from '@nestjs/common';
import { myDataSource } from '../../ormconfig';
import { DATA_SOURCE } from '../../utils/constants';

@Module({
  providers: [
    {
      provide: DATA_SOURCE,
      useFactory: async () => {
        if (!myDataSource.isInitialized) {
          await myDataSource.initialize();
        }
        return myDataSource;
      },
    },
  ],
  exports: [DATA_SOURCE],
})
export class PostgresModule {}
