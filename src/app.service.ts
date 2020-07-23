import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {

    async methodA(){
        return "This is A method"
    }
}
