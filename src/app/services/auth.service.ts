import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  constructor(private http: Http) { }

  registerUser(data) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(environment.apiUrl + 'auth/signup', data, { headers: headers })
      .map((res: Response) => res.json());
    // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  login(data) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(environment.apiUrl + 'auth/login', data, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  updateUser(userId, data) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(environment.apiUrl + 'auth/update/' + userId, data, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
