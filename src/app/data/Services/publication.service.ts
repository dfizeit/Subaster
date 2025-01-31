import { Injectable } from '@angular/core';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { Observable } from 'rxjs';

import { Publication } from '../Interfaces/publication';
import { Comment } from '../Interfaces/comment';
import { Publish } from '../Interfaces/publish';
import { Subasta } from '../Interfaces/subasta';
import { Puja } from '../Interfaces/puja';
import { User } from '../Interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  HttpUploadOptions = {
    headers: new HttpHeaders(
      {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Content-Type': 'application/json',
    }
    ),
  };
  constructor(private http:HttpClient) {}

  PUBLISH(publish:Publish):Observable<any>{
    return this.http.post(`${environment.hostname}/publish`,JSON.stringify(publish),this.HttpUploadOptions)
  }
  AUCTION(auction:Subasta):Observable<any>{
    return this.http.post(`${environment.hostname}/auction`,JSON.stringify(auction),this.HttpUploadOptions)
  }
  GETAUCTIONS():Observable<any>{
    return this.http.get(`${environment.hostname}/getsubastas`,this.HttpUploadOptions)
  }
  GETAUCTION(id:any):Observable<any>{
    return this.http.get(`${environment.hostname}/getsubasta?id=`+id,this.HttpUploadOptions)
  }
  GETPUJAS(id:any):Observable<any>{
    return this.http.get(`${environment.hostname}/getpujas?id=`+id,this.HttpUploadOptions)
  }
  UPPUJA(puja:Puja,user:User, subasta:Subasta):Observable<any>{
    return this.http.post(`${environment.hostname}/uppuja`,JSON.stringify({puja:puja, user:user,subasta:subasta}),this.HttpUploadOptions)
  }
  GETMAXPUJA(id:any):Observable<any>{
    return this.http.get(`${environment.hostname}/getmaxpuja?id=`+id,this.HttpUploadOptions)
  }
  getPost():Observable<any>{
    return this.http.get(`${environment.hostname}/getpublicaciones`,this.HttpUploadOptions);
  }
  GETPUBLICATION(id:any):Observable<any>{
    console.log(id);
    
    return this.http.get(`${environment.hostname}/getpublicacion?id=`+id,this.HttpUploadOptions);
  }
  GETDIRECTION(id:any):Observable<any>{
    return this.http.get(`${environment.hostname}/getdireccion?id=`+id,this.HttpUploadOptions);
  }
  GETMEDIA(id:any):Observable<any>{
    return this.http.get(`${environment.hostname}/getmedia?id=`+id,this.HttpUploadOptions);
  }

  /**
  * @returns Arreglo de usuarios de ejemplo
  */
  obtenerEjemplos(): Publication {

    let ejemplo: Publication = {
      id: 0,
      tittle: "TUBOS pvc lote 500",
      price: "500000",
      date_i: "10/09/2022",
      date_e: "10/12/2022",
      material: "PVC",
      brand: "Genérico",
      model: "Genérico",
      lenght: "1m",
      diameter: "110mm",
      weight: "-",
      source: "-",
      observations: "-",
      image: '-'
    }

    return ejemplo;
  }

  obtenerComentarios(): Comment[] {
    let comentario: Comment[] = [{
      id: 1,
      img: "user_coment.png",
      name: "Juan Garcia",
      comment: "Buena calidad y buen precio."
    },{
      id: 2,
      img: "user_coment.png",
      name: "Enrique Lopez",
      comment: "Está muy bueno."
    },{
      id: 3,
      img: "user_coment.png",
      name: "Juan Mendéz",
      comment: "Totalmente satisfactorio."
    }
    ]

    return comentario;
  }
}
