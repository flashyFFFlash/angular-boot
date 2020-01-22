import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { RestService } from 'src/app/core/service/rest.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  env;

  constructor(
    private fb: FormBuilder, private http: HttpClient, @Inject('env') private environment,
    private message: NzMessageService, private restService: RestService) {
    this.env = environment;
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });

  }

  submit() {
    console.log(this.form.value);
    const params = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };

    this.restService.submitFormData('/login', params).then((r: any) => {
      if (r.code === 1) {
        this.message.info('登录成功');
      } else {
        this.message.error('登录失败!' + r.description);
      }
    }).catch(e => {
      console.error(e);
    });


    this.testCreateUser();
  }

  testCreateUser() {
    this.restService.post('/user/create', {
      username: 'zhangsan',
    }).then(r => {
      if (r.code === 1) {
        console.log('创建成功');
      }
    });

  }
}
