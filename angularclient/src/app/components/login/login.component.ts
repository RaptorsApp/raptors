import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {environment} from 'src/environments/environment';
import {RobotTaskService} from "../../services/robotTask.service";
import {StoreService} from "../../services/store.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private toast: ToastrService) {
  }

  ngOnInit() {
    window.addEventListener('message', (event) => {
        if(event.data && typeof event.data === 'string' && event.origin.includes(environment.dashboardUrl)) {
          const credentials = JSON.parse(event.data);
          this.email = credentials.login;
          this.password = credentials.password;
          this.login();
        }
    });
  }


  login() {
    this.authService.login(this.email, this.password).subscribe(userData => {
      if (userData!==null) {
        sessionStorage.setItem('token', btoa(this.email + ':' + this.password));
        localStorage.setItem('userData', btoa(JSON.stringify(userData.rolesIDs)));
        localStorage.setItem('userID', btoa(JSON.stringify(userData.id)));

        this.router.navigate(['']);
        //alert("Logged");
        this.toast.success("Zalogowano poprawnie")
      } else {
        this.toast.error("Błąd uwierzytelnienia")
      }
    },error => this.toast.error("Niepoprawne dane logowania")
    );
  }

}
