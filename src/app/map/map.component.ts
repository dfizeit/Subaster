import { Component, OnInit } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { User } from '../data/Interfaces/user';
import { UserService } from '../data/Services/user.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  usuario:User;
  map:any
  constructor(private _user:UserService) {
    this.usuario = this._user.getUser();
  }

  ngOnInit(): void {
    if(sessionStorage.getItem("id") != null){
      this.usuario = this._user.getUser()
      console.log(this.usuario);
      this.map = new google.maps.Map(document.getElementById('google') as HTMLElement, {
        center: {lat: this.usuario.direccion.latitud, lng: this.usuario.direccion.longitud},
        zoom: 15
      });
      let marker = new google.maps.Marker({
        position: {lat: this.usuario.direccion.latitud, lng: this.usuario.direccion.longitud},
        map: this.map,
        title: "Tu Direccion"
      });
      this._user.getEmiter().subscribe( data => {
        this.usuario = this._user.getUser()
        console.log(this.usuario);
        this.map = new google.maps.Map(document.getElementById('google') as HTMLElement, {
          center: {lat: this.usuario.direccion.latitud, lng: this.usuario.direccion.longitud},
          zoom: 15,
        });
        let marker = new google.maps.Marker({
          position: {lat: this.usuario.direccion.latitud, lng: this.usuario.direccion.longitud},
          map: this.map,
          title: "Tu Direccion"
        });
      })
    }
    
  }

}
