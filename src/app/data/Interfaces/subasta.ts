import { Categoria } from "./categoria";
import { Estadoproducto } from "./estadoproducto";
import { Unidad } from "./unidad";
import { Direccion } from "./direccion";
import { MediaContent } from "./media-content";
import { Estadopublicacion } from "./estadopublicacion";

export interface Subasta {
    id:String,
    nombre:String;
    descripcion:String;
    categoria:Categoria["id"];
    unidad:Unidad["id"];
    estadopublicacion:Estadopublicacion["id"];
    estadoproducto:Estadoproducto["id"];
    fechapublicacion:Date;
    fechafinalizacion:Date;
    precioinicial:Number;
    cantidad:Number;
    direccion:Direccion;
    url:Array<MediaContent>
}
