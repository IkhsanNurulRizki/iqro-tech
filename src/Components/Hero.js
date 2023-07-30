import React,{Component} from "react";

export class Hero extends Component{
    render(){
        return(
            <section id="hero" className="d-flex align-items-center">
                <div className="container" data-aos="zoom-out" data-aos-delay="100">
                <h1>Belajar mengaji itu <span>Indah</span></h1>
                <h2>"Ilmu lebih utama daripada harta. Sebab ilmu warisan para 
                    Nabi adapun harta adalah warisan Qorun, Firaun, dan lainnya. 
                    Ilmu lebih utama dari harta karena ilmu itu menjaga kamu, kalau harta kamulah yang menjaganya".
                </h2>
                </div>
            </section>
        )
    }
}