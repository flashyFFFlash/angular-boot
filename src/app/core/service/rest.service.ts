import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParameterCodec, HttpParams, HttpHeaders } from '@angular/common/http';

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


@Injectable({
  providedIn: 'root'
})
export class RestService {

  private csrfToken: string;
  private contextPathData: string;

  setCsrfToken(token: string): void {
    this.csrfToken = token;
  }
  getCsrfToken() {
    return this.csrfToken;
  }

  constructor(private http: HttpClient, @Inject('env') private env) {
  }

  getUrl(urlData: string): string {
    return this.env.contextPath + '/' + urlData;
  }

  /**
   * 以 `application/x-www-form-urlencoded` 表单形式提交数据.
   * @param urlData 地址
   * @param params 参数
   * @param headers 请求头
   */
  submitFormData(urlData: string, params: {}, headers?: HttpHeaders): Promise<any> {
    urlData = this.getUrl(urlData);
    let postHeaders = new HttpHeaders()
      .set('X-CSRF-TOKEN', this.csrfToken)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    if (headers) {
      headers.keys().forEach(key => {
        postHeaders = postHeaders.append(key, headers.get(key));
      });
    }
    let body = new HttpParams({ encoder: new CustomHttpParameterEncoder() });
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value = params[key];
        body = body.append(key, value);
      }
    }
    return this.http
      .post(urlData, body.toString(), { headers: postHeaders })
      .toPromise()
      .catch(this.handleError);
  }

  get(urlData: string, params?: {}): Promise<any> {
    urlData = this.getUrl(urlData);
    let getParams = new HttpParams();
    if (params) {
      for (const p in params) {
        if (params.hasOwnProperty(p)) {
          getParams = getParams.set(p, params[p]);
        }
      }
    }
    return this.http
      .get(urlData, { params: getParams })
      .toPromise()
      .catch(this.handleError);
  }

  post(urlData: string, params?: {}): Promise<any> {
    urlData = this.getUrl(urlData);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-CSRF-TOKEN', this.csrfToken);
    return this.http
      .post(urlData, params, { headers })
      .toPromise()
      .catch(this.handleError);
  }

  put(urlData: string, params?: {}): Promise<any> {
    urlData = this.getUrl(urlData);
    return this.http.put(urlData, params).toPromise()
      .catch(this.handleError);
  }

  delete(urlData: string, params?: {}): Promise<any> {
    urlData = this.getUrl(urlData);
    return this.http.delete(urlData).toPromise().catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }


}
