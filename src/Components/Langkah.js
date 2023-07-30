import React,{Component} from "react";

export class Langkah extends Component{
    render(){
        return(
// <!-- ======= Step info Section ======= -->
    <section id="featured-services" className="featured-services">
        <div className="container" data-aos="fade-up">

        <div className="row">
            <div className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
            <div className="icon-box" data-aos="fade-up" data-aos-delay="100">
                <div className="icon"></div>
                <h4 className="title"><a href="">TAHAP 1</a></h4>
                <p className="description">Kamu bisa memilih terlebih dahulu bacaan yang akan kamu ucapkan dengan memilih juz, surah, dan juga ayat.</p>
            </div>
            </div>

            <div className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
            <div className="icon-box" data-aos="fade-up" data-aos-delay="200">
                <div className="icon"></div>
                <h4 className="title"><a href="">TAHAP 2</a></h4>
                <p className="description">Kemudian kamu dapat mengucapkan bacaan yang sudah kamu pilih dengan menekan tombol "Mulai Mengaji".
                </p>
            </div>
            </div>

            <div className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
            <div className="icon-box" data-aos="fade-up" data-aos-delay="300">
                <div className="icon"></div>
                <h4 className="title"><a href="">TAHAP 3</a></h4>
                <p className="description">Setelah teks muncul, kamu cukup tekan "Cek Bacaan" untuk mengecek bacaanmu.</p>
            </div>
            </div>

            <div className="col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0">
            <div className="icon-box" data-aos="fade-up" data-aos-delay="400">
                <div className="icon"></div>
                <h4 className="title"><a href="">SELESAI</a></h4>
                <p className="description">Setelah proses pengecekan selesai, kamu dapat mendengarkan audio lantunan Al-Quran dengan menekan 
                tombol "Dengarkan", Kamu bisa melakukan pengecekan ini secara berulang-ulang dengan menekan tombol
                "Memulai ulang" dan kamu bisa lakukan kembali dari tahap awal.</p>
            </div>
            </div>
        </div>
        </div>
    </section>
//   <!-- End step info Section -->
        )
    }
}