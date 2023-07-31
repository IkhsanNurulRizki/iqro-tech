import React, { useState, useEffect } from 'react';

const Inti = () => {
  const [juzList, setJuzList] = useState([]);
  const [surahList, setSurahList] = useState([]);
  const [ayahList, setAyahList] = useState([]);
  const [selectedJuz, setSelectedJuz] = useState('');
  const [selectedSurah, setSelectedSurah] = useState('');
  const [selectedAyat, setSelectedAyat] = useState('');
  const [hasilSpeechRecognition, setHasilSpeechRecognition] = useState('');
  const [jumlahKesalahan, setJumlahKesalahan] = useState(0);

  useEffect(() => {
    // Permintaan ke API untuk mendapatkan daftar juz
    fetch('https://api.alquran.cloud/v1/juz')
      .then(response => response.json())
      .then(data => {
        setJuzList(data.data);
      })
      .catch(error => {
        console.log('Terjadi kesalahan saat mengambil daftar juz:', error);
      });
  }, []);

  useEffect(() => {
    // Permintaan ke API untuk mendapatkan daftar surah berdasarkan juz yang dipilih
    if (selectedJuz !== '') {
      fetch(`https://api.alquran.cloud/v1/juz/${selectedJuz}/quran-uthmani`)
        .then(response => response.json())
        .then(data => {
          const surahList = [];
          data.data.ayahs.forEach(ayah => {
            const surah = ayah.surah;
            if (!surahList.includes(surah.number)) {
              surahList.push(surah.number);
            }
          });
          setSurahList(surahList);
        })
        .catch(error => {
          console.log('Terjadi kesalahan saat mengambil daftar surah:', error);
        });
    }
  }, [selectedJuz]);

  useEffect(() => {
    // Permintaan ke API untuk mendapatkan jumlah ayat dalam surah yang dipilih
    if (selectedSurah !== '') {
      fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/quran-uthmani`)
        .then(response => response.json())
        .then(data => {
          setAyahList(Array.from({ length: data.data.numberOfAyahs }, (_, i) => i + 1));
        })
        .catch(error => {
          console.log('Terjadi kesalahan saat mengambil jumlah ayat:', error);
        });
    }
  }, [selectedSurah]);

  const startSpeechRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'ar-AR';
    recognition.start();

    recognition.onresult = function (event) {
      const result = event.results[0][0].transcript;
      const arabicText = addArabicDiacritics(result);

      setHasilSpeechRecognition(arabicText);
    };
  };

  const addArabicDiacritics = (text) => {
    const diacriticsMap = {
      'َ': /[\u064B-\u064C]/g, // Fathah
      'ُ': /[\u064D-\u064E]/g, // Dammah
      'ِ': /[\u064F-\u0650]/g, // Kasrah
      'ً': /[\u064B]/g, // Tanwin Fathah
      'ٌ': /[\u064C]/g, // Tanwin Dammah
      'ٍ': /[\u064D]/g, // Tanwin Kasrah
      'ْ': /[\u0652]/g, // Sukun
      'ّ': /[\u0651]/g, // Shaddah
    };

    let textWithDiacritics = text;

    for (const [diacritic, regex] of Object.entries(diacriticsMap)) {
      textWithDiacritics = textWithDiacritics.replace(regex, diacritic);
    }
    return textWithDiacritics;
  };

  const hitungKesalahan = (bacaanAsli, bacaanPengguna) => {
    // Menginisialisasi matriks untuk menyimpan nilai jarak
  const m = bacaanAsli.length;
  const n = bacaanPengguna.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  // Inisialisasi nilai awal matriks
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // Menghitung jarak menggunakan algoritma Levenshtein Distance
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (bacaanAsli[i - 1] === bacaanPengguna[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  // Jarak terakhir di matriks adalah jumlah kesalahan
  const jumlahKesalahan = dp[m][n];
    return jumlahKesalahan;
  };

  const highlightKesalahan = (bacaanAsli, bacaanPengguna, jumlahKesalahan) => {
    let highlightedText = '';

  // Pastikan kedua teks memiliki panjang yang sama
  const minLength = Math.min(bacaanAsli.length, bacaanPengguna.length);
  
  for (let i = 0; i < minLength; i++) {
    // Jika huruf pada teks asli tidak sama dengan huruf pada teks pengguna
    if (bacaanAsli[i] !== bacaanPengguna[i]) {
      // Tambahkan tanda warna merah tua pada huruf yang berbeda
      highlightedText += `<span style="color: darkred">${bacaanPengguna[i]}</span>`;
    } else {
      // Jika huruf pada teks asli sama dengan huruf pada teks pengguna
      highlightedText += bacaanPengguna[i];
    }
  }

  // Tambahkan sisa huruf jika ada (untuk memastikan kedua teks memiliki panjang yang sama)
  if (bacaanAsli.length > minLength) {
    highlightedText += bacaanAsli.slice(minLength);
  } else if (bacaanPengguna.length > minLength) {
    highlightedText += bacaanPengguna.slice(minLength);
  }
    return highlightedText;
  };

  const cekBacaanHandler = () => {
    const selectedSurah = surahDropdown.value;
  const selectedAyat = ayatDropdown.value;

  if (selectedSurah !== '' && selectedAyat !== '') {
    // Permintaan ke API untuk mendapatkan teks bacaan ayat asli
    fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/quran-uthmani`)
      .then(response => response.json())
      .then(surahData => {
        const selectedAyahText = surahData.data.ayahs[selectedAyat - 1].text;

        // Menghapus notifikasi kesalahan sebelumnya (jika ada)
        const notifikasi = document.querySelector('.notifikasi');
        if (notifikasi) {
          notifikasi.remove();
        }

        // Membandingkan bacaan pengguna dengan teks ayat dari Quran API
        const bacaanPengguna = teksQuran.innerText;
        const bacaanAsli = removeDiacritics(selectedAyahText);
        const jumlahKesalahan = hitungKesalahan(bacaanAsli, removeDiacritics(bacaanPengguna));

        // Menampilkan notifikasi jumlah kesalahan sebagai pop-up
        if (jumlahKesalahan > 0) {
          window.alert(`Terdapat ${jumlahKesalahan} kesalahan pada bacaanmu`);
        } else {
          window.alert('Tidak ada kesalahan pada bacaanmu');
        }

        // Menampilkan teks bacaan asli pada kolom "Bacaan Asli"
        const outputCekBacaan = document.getElementById('outputCekBacaan');
        outputCekBacaan.innerText = bacaanAsli;

        // Menampilkan teks yang sudah ditandai dengan warna merah tua di kolom "Bacaan Anda"
        const teksBacaanPengguna = document.getElementById('teksQuran').innerText;
        const teksBacaanPenggunaDitandai = menandaiKesalahan(selectedAyahText, teksBacaanPengguna, jumlahKesalahan);
        const teksBacaanPenggunaElement = document.getElementById('teksQuran');
        teksBacaanPenggunaElement.innerHTML = teksBacaanPenggunaDitandai;
        outputCekBacaan.innerHTML = menandaiKesalahan(selectedAyahText, bacaanPengguna);

        // Menampilkan tombol "Rekomendasi Suara" (jika ada) setelah melakukan pengecekan
        const rekomendasiSuaraBtn = document.getElementById('rekomendasiSuaraBtn');
        rekomendasiSuaraBtn.style.display = jumlahKesalahan > 0 ? 'block' : 'none';
      })
      .catch(error => {
        console.log('Terjadi kesalahan saat mengambil teks Al-Quran:', error);
      });
    }
  };

  const getAudioRekomendasiSuara = () => {
    const selectedSurah = surahDropdown.value;
    const selectedAyat = ayatDropdown.value;

    const rekomendasiSuaraBtn = document.getElementById('rekomendasiSuaraBtn');
    const audioPlayer = document.getElementById('audioRekomendasiSuara');

  if (selectedSurah !== '' && selectedAyat !== '') {
    // Permintaan ke API untuk mendapatkan data audio rekomendasi suara
    fetch(`https://api.alquran.cloud/v1/ayah/${selectedSurah}/${selectedAyat}/ar.alafasy`)
      .then(response => response.json())
      .then(data => {
        const audioUrl = data.data.audio;
        const audioPlayer = new Audio(audioUrl);

        // Memutar audio saat tombol "Rekomendasi Suara" ditekan
        const rekomendasiSuaraBtn = document.getElementById('rekomendasiSuaraBtn');
        rekomendasiSuaraBtn.addEventListener('click', function () {
          audioPlayer.play();
        });

        // Aktifkan tombol "Rekomendasi Suara" dan atur audio player dengan audio dari Quran API
        rekomendasiSuaraBtn.style.display = 'block';
        rekomendasiSuaraBtn.addEventListener('click', function () {
          audioPlayer.play();
        });

        // Atur sumber audio untuk audio player
        audioPlayer.src = audioUrl;
      })

      // Event listener ketika tombol "Cek Bacaan" ditekan
      cekBacaanBtn.addEventListener('click', cekBacaanHandler);

      // Event listener ketika tombol "Rekomendasi Suara" ditekan
      rekomendasiSuaraBtn.addEventListener('click', function () {
        getAudioRekomendasiSuara();
      })

      .catch(error => {
        console.log('Terjadi kesalahan saat mengambil data audio:', error);
      });
    }
  };

  return (
    <section id="inti">
      <div>
        <label>Teks Al-Quran dari API:</label>
      </div>
      <div className="centered">
        <select id="juzDropdown" onChange={(e) => setSelectedJuz(e.target.value)}>
          <option value="">Pilih Juz</option>
          {juzList.map(juz => (
            <option key={juz.index} value={juz.index}>{`Juz ${juz.index}`}</option>
          ))}
        </select>
        <select id="surahDropdown" onChange={(e) => setSelectedSurah(e.target.value)} disabled={!selectedJuz}>
          <option value="">Pilih Surah</option>
          {surahList.map(surah => (
            <option key={surah} value={surah}>{`Surah ${surah}`}</option>
          ))}
        </select>
        <select id="ayatDropdown" onChange={(e) => setSelectedAyat(e.target.value)} disabled={!selectedSurah}>
          <option value="">Pilih Ayat</option>
          {ayahList.map(ayah => (
            <option key={ayah} value={ayah}>{`Ayat ${ayah}`}</option>
          ))}
        </select>
        <div className="flex">
          <div>
            <button id="mulaiMengajiBtn" disabled={!selectedAyat} onClick={startSpeechRecognition}>
              Mulai Mengaji
            </button>
          </div>
          <div>
            <button id="cekBacaanBtn" disabled onClick={cekBacaanHandler}>
              Cek Bacaan
            </button>
          </div>
        </div>
      </div>
      <table className="table" style={{ fontSize: '28px' }}>
        <tbody>
          <tr>
            <th>Bacaan Anda</th>
            <th>Bacaan Asli</th>
          </tr>
          <tr>
            <td id="teksQuran">{hasilSpeechRecognition}</td>
            <td id="outputCekBacaan">{/* Tampilkan bacaan asli di sini */}</td>
          </tr>
        </tbody>
      </table>
      {/* Audio dan tombol rekomendasi suara di sini */}
    </section>
  );
};
export default Inti;

// import axios from 'axios';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faPlay } from '@fortawesome/free-solid-svg-icons';
// const addArabicDiacritics = (text) => {
//   const diacriticsMap = {
//     'َ': /[\u064B-\u064C]/g, // Fathah
//     'ُ': /[\u064D-\u064E]/g, // Dammah
//     'ِ': /[\u064F-\u0650]/g, // Kasrah
//     'ً': /[\u064B]/g, // Tanwin Fathah
//     'ٌ': /[\u064C]/g, // Tanwin Dammah
//     'ٍ': /[\u064D]/g, // Tanwin Kasrah
//     'ْ': /[\u0652]/g, // Sukun
//     'ّ': /[\u0651]/g, // Shaddah
//   };

//   let textWithDiacritics = text;

//   for (const [diacritic, regex] of Object.entries(diacriticsMap)) {
//     textWithDiacritics = textWithDiacritics.replace(regex, diacritic);
//   }

//   return textWithDiacritics;
// };

// const Inti = () => {
//   const [selectedJuz, setSelectedJuz] = useState('');
//   const [surahList, setSurahList] = useState([]);
//   const [selectedSurah, setSelectedSurah] = useState('');
//   const [ayahList, setAyahList] = useState([]);
//   const [selectedAyah, setSelectedAyah] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const [recognizedText, setRecognizedText] = useState('');
//   const [hasilSpeechRecognition, setHasilSpeechRecognition] = useState('');
  

//   useEffect(() => {
//     // Panggil API Quran ketika nilai selectedSurah dan selectedAyah berubah
//     if (selectedSurah && selectedAyah) {
//       const url = `https://api.alquran.cloud/v1/surah/${selectedSurah}/ayah/${selectedAyah}/quran-uthmani`;
//       axios
//         .get(url)
//         .then(response => {
//           const teksBacaan = response.data.data.text;
//           setHasilSpeechRecognition(teksBacaan);
//         })
//         .catch(error => {
//           console.log('Terjadi kesalahan saat mengambil data dari API Quran:', error);
//         });
//     }
//   }, [selectedSurah, selectedAyah]);

//   useEffect(() => {
//     // Panggil API atau lakukan pemrosesan data statis untuk mendapatkan daftar surah berdasarkan juz yang dipilih
//     if (selectedJuz !== '') {
//       fetch(`https://api.alquran.cloud/v1/juz/${selectedJuz}/quran-uthmani`)
//         .then(response => response.json())
//         .then(data => {
//           const uniqueSurahs = Array.from(new Set(data.data.ayahs.map(ayah => ayah.surah.number))).map(number => {
//             const surah = data.data.ayahs.find(ayah => ayah.surah.number === number).surah;
//             return {
//               number: surah.number,
//               englishName: surah.englishName,
//               name: surah.name,
//             };
//           });
//           setSurahList(uniqueSurahs);
//         })
//         .catch(error => {
//           console.log('Terjadi kesalahan saat mengambil daftar surah:', error);
//         });
//     }
//   }, [selectedJuz]);

//   useEffect(() => {
//     // Panggil API atau lakukan pemrosesan data statis untuk mendapatkan daftar ayat berdasarkan surah yang dipilih
//     if (selectedSurah !== '') {
//       fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/quran-uthmani`)
//         .then(response => response.json())
//         .then(data => {
//           const selectedAyahs = Array.from({ length: data.data.numberOfAyahs }, (_, index) => index + 1);
//           setAyahList(selectedAyahs);
//         })
//         .catch(error => {
//           console.log('Terjadi kesalahan saat mengambil daftar ayat:', error);
//         });
//     }
//   }, [selectedJuz, selectedSurah]);

//   const cekBacaan = () => {
//     if (!selectedSurah || !selectedAyah) {
//       console.log('Pilih surah dan ayat terlebih dahulu');
//       return;
//     }

//     // Implementasi logika untuk memeriksa bacaan dan menambahkan diakritik Arab
//     const bacaanWithDiacritics = addArabicDiacritics(hasilSpeechRecognition);

//     // Menampilkan hasil bacaan yang sudah ditambahkan diakritik Arab di <td id="outputCekBacaan"></td>
//     document.getElementById('outputCekBacaan').innerHTML = bacaanWithDiacritics;
//   };

//   const handleHasilSpeechRecognition = (hasil) => {
//     setHasilSpeechRecognition(hasil);
//   };

//    // Implementasi logika untuk memeriksa bacaan dan menambahkan diakritik Arab
//   const bacaanWithDiacritics = addArabicDiacritics(hasilSpeechRecognition);

//   // Menampilkan hasil bacaan yang sudah ditambahkan diakritik Arab di <td id="outputCekBacaan"></td>
//   document.getElementById('outputCekBacaan').innerHTML = bacaanWithDiacritics;

//   const handleJuzChange = (e) => {
//     setSelectedJuz(e.target.value);
//     setSelectedSurah('');
//     setSelectedAyah('');
//   };

//   const handleSurahChange = (e) => {
//     setSelectedSurah(e.target.value);
//     setSelectedAyah('');
//   };

//   const handleAyahChange = (e) => {
//     setSelectedAyah(e.target.value);
//   };

//   const MAX_LISTENING_TIME = 60000; // 1 menit (dalam milidetik)
//   const NO_SOUND_THRESHOLD = 3000; // 3 detik (dalam milidetik)

//   const handleStartListening = () => {
//     setIsListening(true);
//     setRecognizedText('');
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = 'ar-SA';

//     let timer;
//     let isSoundDetected = false;

//     recognition.onstart = () => {
//       timer = setTimeout(() => {
//         recognition.stop();
//         setIsListening(false);
//       }, MAX_LISTENING_TIME);
//     };

//     recognition.onsoundstart = () => {
//       clearTimeout(timer);
//       isSoundDetected = true;
//     };

//     recognition.onsoundend = () => {
//       if (isSoundDetected) {
//         timer = setTimeout(() => {
//           recognition.stop();
//           setIsListening(false);
//         }, NO_SOUND_THRESHOLD);
//       }
//     };

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setRecognizedText(transcript);
//       setIsListening(false);
//     };

//     recognition.start();
//   };

//   const isMulaiMengajiDisabled = selectedJuz === '' || selectedSurah === '' || selectedAyah === '';

//   return (
//     <section id="inti">
//       <div>
//         <label>Teks Al-Quran dari API:</label>
//       </div>
//       <div className="centered">
//         <select id="juzDropdown" value={selectedJuz} onChange={handleJuzChange}>
//           <option value="">Pilih Juz</option>
//           <option value="1">Juz 1</option>
//           <option value="2">Juz 2</option>
//           <option value="3">Juz 3</option>
//           <option value="4">Juz 4</option>
//           <option value="5">Juz 5</option>
//           <option value="6">Juz 6</option>
//           <option value="7">Juz 7</option>
//           <option value="8">Juz 8</option>
//           <option value="9">Juz 9</option>
//          <option value="10">Juz 10</option>
//          <option value="11">Juz 11</option>
//          <option value="12">Juz 12</option>
//          <option value="13">Juz 13</option>
//          <option value="14">Juz 14</option>
//          <option value="15">Juz 15</option>
//          <option value="16">Juz 16</option>
//          <option value="17">Juz 17</option>
//          <option value="18">Juz 18</option>
//          <option value="19">Juz 19</option>
//          <option value="20">Juz 20</option>
//          <option value="21">Juz 21</option>
//          <option value="22">Juz 22</option>
//          <option value="23">Juz 23</option>
//          <option value="24">Juz 24</option>
//          <option value="25">Juz 25</option>
//          <option value="26">Juz 26</option>
//          <option value="27">Juz 27</option>
//          <option value="28">Juz 28</option>
//          <option value="29">Juz 29</option>
//          <option value="30">Juz 30</option>
//         </select>
//         <select id="surahDropdown" disabled={selectedJuz === ''} value={selectedSurah} onChange={handleSurahChange}>
//           <option value="">Pilih Surah</option>
//           {surahList.map((surah) => (
//             <option key={surah.number} value={surah.number}>
//               {surah.englishName}
//             </option>
//           ))}
//         </select>
//         <select id="ayatDropdown" disabled={selectedSurah === ''} value={selectedAyah} onChange={handleAyahChange}>
//           <option value="">Pilih Ayat</option>
//           {ayahList.map((ayahNumber) => (
//             <option key={ayahNumber} value={ayahNumber}>
//               Ayat {ayahNumber}
//             </option>
//           ))}
//         </select>
//         <div className="flex">
//         <div>
//         <button disabled={!selectedAyah} onClick={() => handleHasilSpeechRecognition('Hasil Speech Recognition')}>
//           Mulai Mengaji
//         </button>
//         <button disabled={!hasilSpeechRecognition} onClick={cekBacaan}>
//           Cek Bacaan
//         </button>
//       </div>
//       </div>
//       <table className="table" style={{ fontSize: '28px' }}>
//         <tbody>
//           <tr>
//             <th>Bacaan Anda</th>
//             <th>Bacaan Asli</th>
//           </tr>
//           <tr>
//             <td id="teksQuran">{hasilSpeechRecognition}</td>
//             <td id="outputCekBacaan"></td>
//           </tr>
//         </tbody>
//       </table>
//       {/* audio untuk memuat audio rekomendasi suara */}
//       <audio id="audioRekomendasiSuara" controls style={{ display: 'none' }}></audio>
//       {/* tombol Rekomendasi Suara dengan ikon play */}
//       <button id="rekomendasiSuaraBtn" className="enabled" style={{ display: 'none' }}>
//         <i className="fa fa-play"></i> Rekomendasi Suara
//       </button>
//       <div id="pesan" className="notifikasi"></div>
//       </div>
//     </section>
//   );
// };

// export default Inti;