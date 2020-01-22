import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';

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
    private message: NzMessageService) {
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

    let body = new HttpParams({ encoder: new CustomHttpParameterEncoder() });
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value = params[key];
        body = body.append(key, value);
      }
    }
    const postHeaders = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    this.http.post(this.env.contextPath + '/login', body.toString(), { headers: postHeaders }).toPromise().then((r: any) => {
      if (r.code === 1) {
        this.message.info('登录成功');
      } else {
        this.message.error('登录失败!' + r.description);
      }
    }).catch(e => {
      console.error(e);
    });

  }

}
/**
 * 处理form表单提交时候的参数不能正确的编码，导致数据里有 ‘+’ 出现时会丢失，比如加密的密码传到后台就会报错
 */
export class CustomHttpParameterEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }
  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }
  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }
  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
