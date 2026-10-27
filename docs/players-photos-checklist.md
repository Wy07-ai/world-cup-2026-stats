# Daftar Foto Pemain yang Perlu Disiapkan (Claude #4)

Diperbarui: 2026-10-27. Dibuat otomatis dari `src/data/players.json` (1.248 pemain, 48 tim x 26). Berkas foto **belum ada**: `public/players/` saat ini hanya berisi `.gitkeep`.

## Aturan berkas

- Format **`.webp`** (PRD Bab 3.1 dan 4.1; Bab 8.2 menyebut `next/image` akan melayani format ini).
- **Latar transparan** (PRD Bab 5.2: foto "pop-out" pada `PlayerCard`).
- Ukuran berkas wajar agar target Lighthouse 90+ (PRD Bab 8.2) tercapai. PRD tidak menyebut angka untuk foto pemain; saran Claude #4 (**bukan aturan PRD**): sisi panjang sekitar 600 px dan di bawah ~80 KB per berkas.
- Nama berkas **HURUF KECIL SEMUA**, persis sama dengan `photoUrl` di `players.json`, yaitu `{id huruf kecil}.webp`. Contoh: `PL-ARG-10` menjadi `pl-arg-10.webp`. Di server Linux/Vercel `PL-ARG-10.webp` **tidak sama** dengan `pl-arg-10.webp` dan fotonya akan gagal dimuat.
- Letakkan di `public/players/`, jangan di subfolder (path di data adalah `/players/{nama}.webp`).
- Foto yang belum ada harus ditangani fallback avatar oleh UI (PRD Bab 8.1), bukan ikon rusak.
- Hak cipta/lisensi foto **belum terverifikasi**; pastikan sumber foto boleh dipakai.

Total berkas yang dibutuhkan: **1248**.

## Ringkasan per tim

| Tim | Grup | Jumlah foto |
|---|---|---|
| CZE (Czechia) | A | 26 |
| KOR (Korea Republic) | A | 26 |
| MEX (Mexico) | A | 26 |
| RSA (South Africa) | A | 26 |
| BIH (Bosnia and Herzegovina) | B | 26 |
| CAN (Canada) | B | 26 |
| QAT (Qatar) | B | 26 |
| SUI (Switzerland) | B | 26 |
| BRA (Brazil) | C | 26 |
| HAI (Haiti) | C | 26 |
| MAR (Morocco) | C | 26 |
| SCO (Scotland) | C | 26 |
| AUS (Australia) | D | 26 |
| PAR (Paraguay) | D | 26 |
| TUR (Türkiye) | D | 26 |
| USA (United States) | D | 26 |
| CIV (Côte d'Ivoire) | E | 26 |
| CUW (Curaçao) | E | 26 |
| ECU (Ecuador) | E | 26 |
| GER (Germany) | E | 26 |
| JPN (Japan) | F | 26 |
| NED (Netherlands) | F | 26 |
| SWE (Sweden) | F | 26 |
| TUN (Tunisia) | F | 26 |
| BEL (Belgium) | G | 26 |
| EGY (Egypt) | G | 26 |
| IRN (IR Iran) | G | 26 |
| NZL (New Zealand) | G | 26 |
| CPV (Cabo Verde) | H | 26 |
| ESP (Spain) | H | 26 |
| KSA (Saudi Arabia) | H | 26 |
| URU (Uruguay) | H | 26 |
| FRA (France) | I | 26 |
| IRQ (Iraq) | I | 26 |
| NOR (Norway) | I | 26 |
| SEN (Senegal) | I | 26 |
| ALG (Algeria) | J | 26 |
| ARG (Argentina) | J | 26 |
| AUT (Austria) | J | 26 |
| JOR (Jordan) | J | 26 |
| COD (Congo DR) | K | 26 |
| COL (Colombia) | K | 26 |
| POR (Portugal) | K | 26 |
| UZB (Uzbekistan) | K | 26 |
| CRO (Croatia) | L | 26 |
| ENG (England) | L | 26 |
| GHA (Ghana) | L | 26 |
| PAN (Panama) | L | 26 |

## Rincian per tim

### CZE — Czechia (Grup A)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-cze-01.webp` | Matěj Kovář | GK |
| 2 | `pl-cze-02.webp` | David Zima | DF |
| 3 | `pl-cze-03.webp` | Tomáš Holeš | DF |
| 4 | `pl-cze-04.webp` | Robin Hranáč | DF |
| 5 | `pl-cze-05.webp` | Vladimír Coufal | DF |
| 6 | `pl-cze-06.webp` | Štěpán Chaloupek | DF |
| 7 | `pl-cze-07.webp` | Ladislav Krejčí | DF |
| 8 | `pl-cze-08.webp` | Vladimír Darida | MF |
| 9 | `pl-cze-09.webp` | Adam Hložek | FW |
| 10 | `pl-cze-10.webp` | Patrik Schick | FW |
| 11 | `pl-cze-11.webp` | Jan Kuchta | FW |
| 12 | `pl-cze-12.webp` | Lukáš Červ | MF |
| 13 | `pl-cze-13.webp` | Mojmír Chytil | FW |
| 14 | `pl-cze-14.webp` | David Jurásek | DF |
| 15 | `pl-cze-15.webp` | Pavel Šulc | FW |
| 16 | `pl-cze-16.webp` | Jindřich Staněk | GK |
| 17 | `pl-cze-17.webp` | Lukáš Provod | MF |
| 18 | `pl-cze-18.webp` | Michal Sadílek | MF |
| 19 | `pl-cze-19.webp` | Tomáš Chorý | FW |
| 20 | `pl-cze-20.webp` | Jaroslav Zelený | DF |
| 21 | `pl-cze-21.webp` | David Douděra | DF |
| 22 | `pl-cze-22.webp` | Tomáš Souček | MF |
| 23 | `pl-cze-23.webp` | Lukáš Horníček | GK |
| 24 | `pl-cze-24.webp` | Alexandr Sojka | MF |
| 25 | `pl-cze-25.webp` | Hugo Sochůrek | MF |
| 26 | `pl-cze-26.webp` | Denis Višinský | FW |

### KOR — Korea Republic (Grup A)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-kor-01.webp` | Kim Seung-gyu | GK |
| 2 | `pl-kor-02.webp` | Lee Han-beom | DF |
| 3 | `pl-kor-03.webp` | Lee Gi-hyuk | MF |
| 4 | `pl-kor-04.webp` | Kim Min-jae | DF |
| 5 | `pl-kor-05.webp` | Kim Tae-hyeon | DF |
| 6 | `pl-kor-06.webp` | Hwang In-beom | MF |
| 7 | `pl-kor-07.webp` | Son Heung-min | FW |
| 8 | `pl-kor-08.webp` | Paik Seung-ho | MF |
| 9 | `pl-kor-09.webp` | Cho Gue-sung | FW |
| 10 | `pl-kor-10.webp` | Lee Jae-sung | MF |
| 11 | `pl-kor-11.webp` | Hwang Hee-chan | MF |
| 12 | `pl-kor-12.webp` | Song Bum-keun | GK |
| 13 | `pl-kor-13.webp` | Lee Tae-seok | DF |
| 14 | `pl-kor-14.webp` | Cho Wi-je | DF |
| 15 | `pl-kor-15.webp` | Kim Moon-hwan | DF |
| 16 | `pl-kor-16.webp` | Park Jin-seob | DF |
| 17 | `pl-kor-17.webp` | Bae Jun-ho | MF |
| 18 | `pl-kor-18.webp` | Oh Hyeon-gyu | FW |
| 19 | `pl-kor-19.webp` | Lee Kang-in | MF |
| 20 | `pl-kor-20.webp` | Yang Hyun-jun | MF |
| 21 | `pl-kor-21.webp` | Jo Hyeon-woo | GK |
| 22 | `pl-kor-22.webp` | Seol Young-woo | DF |
| 23 | `pl-kor-23.webp` | Jens Castrop | DF |
| 24 | `pl-kor-24.webp` | Kim Jin-gyu | MF |
| 25 | `pl-kor-25.webp` | Eom Ji-sung | MF |
| 26 | `pl-kor-26.webp` | Lee Dong-gyeong | MF |

### MEX — Mexico (Grup A)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-mex-01.webp` | Raúl Rangel | GK |
| 2 | `pl-mex-02.webp` | Jorge Sánchez | DF |
| 3 | `pl-mex-03.webp` | César Montes | DF |
| 4 | `pl-mex-04.webp` | Edson Álvarez | DF |
| 5 | `pl-mex-05.webp` | Johan Vásquez | DF |
| 6 | `pl-mex-06.webp` | Érik Lira | MF |
| 7 | `pl-mex-07.webp` | Luis Romo | MF |
| 8 | `pl-mex-08.webp` | Álvaro Fidalgo | MF |
| 9 | `pl-mex-09.webp` | Raúl Jiménez | FW |
| 10 | `pl-mex-10.webp` | Alexis Vega | FW |
| 11 | `pl-mex-11.webp` | Santiago Giménez | FW |
| 12 | `pl-mex-12.webp` | Carlos Acevedo | GK |
| 13 | `pl-mex-13.webp` | Guillermo Ochoa | GK |
| 14 | `pl-mex-14.webp` | Armando González | FW |
| 15 | `pl-mex-15.webp` | Israel Reyes | DF |
| 16 | `pl-mex-16.webp` | Julián Quiñones | FW |
| 17 | `pl-mex-17.webp` | Orbelín Pineda | MF |
| 18 | `pl-mex-18.webp` | Obed Vargas | MF |
| 19 | `pl-mex-19.webp` | Gilberto Mora | MF |
| 20 | `pl-mex-20.webp` | Mateo Chávez | DF |
| 21 | `pl-mex-21.webp` | César Huerta | FW |
| 22 | `pl-mex-22.webp` | Guillermo Martínez | FW |
| 23 | `pl-mex-23.webp` | Jesús Gallardo | DF |
| 24 | `pl-mex-24.webp` | Luis Chávez | MF |
| 25 | `pl-mex-25.webp` | Roberto Alvarado | FW |
| 26 | `pl-mex-26.webp` | Brian Gutiérrez | MF |

### RSA — South Africa (Grup A)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-rsa-01.webp` | Ronwen Williams | GK |
| 2 | `pl-rsa-02.webp` | Thabang Matuludi | DF |
| 3 | `pl-rsa-03.webp` | Khulumani Ndamane | DF |
| 4 | `pl-rsa-04.webp` | Teboho Mokoena | MF |
| 5 | `pl-rsa-05.webp` | Thalente Mbatha | MF |
| 6 | `pl-rsa-06.webp` | Aubrey Modiba | DF |
| 7 | `pl-rsa-07.webp` | Oswin Appollis | FW |
| 8 | `pl-rsa-08.webp` | Tshepang Moremi | FW |
| 9 | `pl-rsa-09.webp` | Lyle Foster | FW |
| 10 | `pl-rsa-10.webp` | Relebohile Mofokeng | FW |
| 11 | `pl-rsa-11.webp` | Themba Zwane | MF |
| 12 | `pl-rsa-12.webp` | Thapelo Maseko | FW |
| 13 | `pl-rsa-13.webp` | Sphephelo Sithole | MF |
| 14 | `pl-rsa-14.webp` | Mbekezeli Mbokazi | DF |
| 15 | `pl-rsa-15.webp` | Iqraam Rayners | FW |
| 16 | `pl-rsa-16.webp` | Sipho Chaine | GK |
| 17 | `pl-rsa-17.webp` | Evidence Makgopa | FW |
| 18 | `pl-rsa-18.webp` | Samukele Kabini | DF |
| 19 | `pl-rsa-19.webp` | Nkosinathi Sibisi | DF |
| 20 | `pl-rsa-20.webp` | Khuliso Mudau | DF |
| 21 | `pl-rsa-21.webp` | Ime Okon | DF |
| 22 | `pl-rsa-22.webp` | Ricardo Goss | GK |
| 23 | `pl-rsa-23.webp` | Jayden Adams | MF |
| 24 | `pl-rsa-24.webp` | Olwethu Makhanya | DF |
| 25 | `pl-rsa-25.webp` | Kamogelo Sebelebele | FW |
| 26 | `pl-rsa-26.webp` | Bradley Cross | DF |

### BIH — Bosnia and Herzegovina (Grup B)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-bih-01.webp` | Nikola Vasilj | GK |
| 2 | `pl-bih-02.webp` | Nihad Mujakić | DF |
| 3 | `pl-bih-03.webp` | Dennis Hadžikadunić | DF |
| 4 | `pl-bih-04.webp` | Tarik Muharemović | DF |
| 5 | `pl-bih-05.webp` | Sead Kolašinac | DF |
| 6 | `pl-bih-06.webp` | Benjamin Tahirović | MF |
| 7 | `pl-bih-07.webp` | Amar Dedić | DF |
| 8 | `pl-bih-08.webp` | Armin Gigović | MF |
| 9 | `pl-bih-09.webp` | Samed Baždar | FW |
| 10 | `pl-bih-10.webp` | Ermedin Demirović | FW |
| 11 | `pl-bih-11.webp` | Edin Džeko | FW |
| 12 | `pl-bih-12.webp` | Mladen Jurkas | GK |
| 13 | `pl-bih-13.webp` | Ivan Bašić | MF |
| 14 | `pl-bih-14.webp` | Ivan Šunjić | MF |
| 15 | `pl-bih-15.webp` | Amar Memić | MF |
| 16 | `pl-bih-16.webp` | Amir Hadžiahmetović | MF |
| 17 | `pl-bih-17.webp` | Dženis Burnić | MF |
| 18 | `pl-bih-18.webp` | Nikola Katić | DF |
| 19 | `pl-bih-19.webp` | Kerim Alajbegović | FW |
| 20 | `pl-bih-20.webp` | Esmir Bajraktarević | FW |
| 21 | `pl-bih-21.webp` | Stjepan Radeljić | DF |
| 22 | `pl-bih-22.webp` | Martin Zlomislić | GK |
| 23 | `pl-bih-23.webp` | Haris Tabaković | FW |
| 24 | `pl-bih-24.webp` | Nidal Čelik | DF |
| 25 | `pl-bih-25.webp` | Jovo Lukić | FW |
| 26 | `pl-bih-26.webp` | Ermin Mahmić | MF |

### CAN — Canada (Grup B)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-can-01.webp` | Dayne St. Clair | GK |
| 2 | `pl-can-02.webp` | Alistair Johnston | DF |
| 3 | `pl-can-03.webp` | Alfie Jones | DF |
| 4 | `pl-can-04.webp` | Luc de Fougerolles | DF |
| 5 | `pl-can-05.webp` | Joel Waterman | DF |
| 6 | `pl-can-06.webp` | Mathieu Choinière | MF |
| 7 | `pl-can-07.webp` | Stephen Eustáquio | MF |
| 8 | `pl-can-08.webp` | Ismaël Koné | MF |
| 9 | `pl-can-09.webp` | Cyle Larin | FW |
| 10 | `pl-can-10.webp` | Jonathan David | FW |
| 11 | `pl-can-11.webp` | Liam Millar | MF |
| 12 | `pl-can-12.webp` | Tani Oluwaseyi | FW |
| 13 | `pl-can-13.webp` | Derek Cornelius | DF |
| 14 | `pl-can-14.webp` | Jacob Shaffelburg | MF |
| 15 | `pl-can-15.webp` | Moïse Bombito | DF |
| 16 | `pl-can-16.webp` | Maxime Crépeau | GK |
| 17 | `pl-can-17.webp` | Tajon Buchanan | FW |
| 18 | `pl-can-18.webp` | Owen Goodman | GK |
| 19 | `pl-can-19.webp` | Alphonso Davies | DF |
| 20 | `pl-can-20.webp` | Ali Ahmed | FW |
| 21 | `pl-can-21.webp` | Jonathan Osorio | MF |
| 22 | `pl-can-22.webp` | Richie Laryea | DF |
| 23 | `pl-can-23.webp` | Niko Sigur | DF |
| 24 | `pl-can-24.webp` | Promise David | FW |
| 25 | `pl-can-25.webp` | Nathan Saliba | MF |
| 26 | `pl-can-26.webp` | Jayden Nelson | MF |

### QAT — Qatar (Grup B)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-qat-01.webp` | Mahmud Abunada | GK |
| 2 | `pl-qat-02.webp` | Pedro Miguel | DF |
| 3 | `pl-qat-03.webp` | Lucas Mendes | DF |
| 4 | `pl-qat-04.webp` | Issa Laye | DF |
| 5 | `pl-qat-05.webp` | Jassem Gaber | DF |
| 6 | `pl-qat-06.webp` | Abdulaziz Hatem | MF |
| 7 | `pl-qat-07.webp` | Ahmed Alaaeldin | FW |
| 8 | `pl-qat-08.webp` | Edmilson Junior | FW |
| 9 | `pl-qat-09.webp` | Mohammed Muntari | FW |
| 10 | `pl-qat-10.webp` | Hassan Al-Haydos | FW |
| 11 | `pl-qat-11.webp` | Akram Afif | FW |
| 12 | `pl-qat-12.webp` | Karim Boudiaf | MF |
| 13 | `pl-qat-13.webp` | Ayoub Al-Oui | DF |
| 14 | `pl-qat-14.webp` | Homam Ahmed | DF |
| 15 | `pl-qat-15.webp` | Yusuf Abdurisag | FW |
| 16 | `pl-qat-16.webp` | Boualem Khoukhi | DF |
| 17 | `pl-qat-17.webp` | Ahmed Al-Ganehi | MF |
| 18 | `pl-qat-18.webp` | Sultan Al-Brake | DF |
| 19 | `pl-qat-19.webp` | Almoez Ali | FW |
| 20 | `pl-qat-20.webp` | Ahmed Fathy | MF |
| 21 | `pl-qat-21.webp` | Salah Zakaria | GK |
| 22 | `pl-qat-22.webp` | Meshaal Barsham | GK |
| 23 | `pl-qat-23.webp` | Assim Madibo | MF |
| 24 | `pl-qat-24.webp` | Tahsin Jamshid | FW |
| 25 | `pl-qat-25.webp` | Al-Hashmi Al-Hussain | DF |
| 26 | `pl-qat-26.webp` | Mohamed Manai | FW |

### SUI — Switzerland (Grup B)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-sui-01.webp` | Gregor Kobel | GK |
| 2 | `pl-sui-02.webp` | Miro Muheim | DF |
| 3 | `pl-sui-03.webp` | Silvan Widmer | DF |
| 4 | `pl-sui-04.webp` | Nico Elvedi | DF |
| 5 | `pl-sui-05.webp` | Manuel Akanji | DF |
| 6 | `pl-sui-06.webp` | Denis Zakaria | MF |
| 7 | `pl-sui-07.webp` | Breel Embolo | FW |
| 8 | `pl-sui-08.webp` | Remo Freuler | MF |
| 9 | `pl-sui-09.webp` | Johan Manzambi | MF |
| 10 | `pl-sui-10.webp` | Granit Xhaka | MF |
| 11 | `pl-sui-11.webp` | Dan Ndoye | FW |
| 12 | `pl-sui-12.webp` | Yvon Mvogo | GK |
| 13 | `pl-sui-13.webp` | Ricardo Rodriguez | DF |
| 14 | `pl-sui-14.webp` | Ardon Jashari | MF |
| 15 | `pl-sui-15.webp` | Djibril Sow | MF |
| 16 | `pl-sui-16.webp` | Christian Fassnacht | FW |
| 17 | `pl-sui-17.webp` | Rubén Vargas | FW |
| 18 | `pl-sui-18.webp` | Eray Cömert | DF |
| 19 | `pl-sui-19.webp` | Noah Okafor | FW |
| 20 | `pl-sui-20.webp` | Michel Aebischer | MF |
| 21 | `pl-sui-21.webp` | Marvin Keller | GK |
| 22 | `pl-sui-22.webp` | Fabian Rieder | MF |
| 23 | `pl-sui-23.webp` | Zeki Amdouni | FW |
| 24 | `pl-sui-24.webp` | Aurèle Amenda | DF |
| 25 | `pl-sui-25.webp` | Luca Jaquez | DF |
| 26 | `pl-sui-26.webp` | Cedric Itten | FW |

### BRA — Brazil (Grup C)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-bra-01.webp` | Alisson | GK |
| 2 | `pl-bra-02.webp` | Éderson Silva | MF |
| 3 | `pl-bra-03.webp` | Gabriel Magalhães | DF |
| 4 | `pl-bra-04.webp` | Marquinhos | DF |
| 5 | `pl-bra-05.webp` | Casemiro | MF |
| 6 | `pl-bra-06.webp` | Alex Sandro | DF |
| 7 | `pl-bra-07.webp` | Vinícius Júnior | FW |
| 8 | `pl-bra-08.webp` | Bruno Guimarães | MF |
| 9 | `pl-bra-09.webp` | Matheus Cunha | FW |
| 10 | `pl-bra-10.webp` | Neymar | FW |
| 11 | `pl-bra-11.webp` | Raphinha | FW |
| 12 | `pl-bra-12.webp` | Weverton | GK |
| 13 | `pl-bra-13.webp` | Danilo Luiz | DF |
| 14 | `pl-bra-14.webp` | Bremer | DF |
| 15 | `pl-bra-15.webp` | Léo Pereira | DF |
| 16 | `pl-bra-16.webp` | Douglas Santos | DF |
| 17 | `pl-bra-17.webp` | Fabinho | MF |
| 18 | `pl-bra-18.webp` | Danilo Santos | MF |
| 19 | `pl-bra-19.webp` | Endrick | FW |
| 20 | `pl-bra-20.webp` | Lucas Paquetá | MF |
| 21 | `pl-bra-21.webp` | Luiz Henrique | FW |
| 22 | `pl-bra-22.webp` | Gabriel Martinelli | FW |
| 23 | `pl-bra-23.webp` | Ederson Moraes | GK |
| 24 | `pl-bra-24.webp` | Roger Ibañez | DF |
| 25 | `pl-bra-25.webp` | Igor Thiago | FW |
| 26 | `pl-bra-26.webp` | Rayan | FW |

### HAI — Haiti (Grup C)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-hai-01.webp` | Johny Placide | GK |
| 2 | `pl-hai-02.webp` | Carlens Arcus | DF |
| 3 | `pl-hai-03.webp` | Keeto Thermoncy | DF |
| 4 | `pl-hai-04.webp` | Ricardo Adé | DF |
| 5 | `pl-hai-05.webp` | Hannes Delcroix | DF |
| 6 | `pl-hai-06.webp` | Carl Sainté | MF |
| 7 | `pl-hai-07.webp` | Derrick Etienne Jr. | FW |
| 8 | `pl-hai-08.webp` | Martin Expérience | DF |
| 9 | `pl-hai-09.webp` | Duckens Nazon | FW |
| 10 | `pl-hai-10.webp` | Jean-Ricner Bellegarde | MF |
| 11 | `pl-hai-11.webp` | Louicius Deedson | FW |
| 12 | `pl-hai-12.webp` | Alexandre Pierre | GK |
| 13 | `pl-hai-13.webp` | Duke Lacroix | DF |
| 14 | `pl-hai-14.webp` | Leverton Pierre | MF |
| 15 | `pl-hai-15.webp` | Ruben Providence | FW |
| 16 | `pl-hai-16.webp` | Lenny Joseph | FW |
| 17 | `pl-hai-17.webp` | Danley Jean Jacques | MF |
| 18 | `pl-hai-18.webp` | Wilson Isidor | FW |
| 19 | `pl-hai-19.webp` | Yassin Fortuné | FW |
| 20 | `pl-hai-20.webp` | Frantzdy Pierrot | FW |
| 21 | `pl-hai-21.webp` | Josué Casimir | FW |
| 22 | `pl-hai-22.webp` | Jean-Kévin Duverne | DF |
| 23 | `pl-hai-23.webp` | Josué Duverger | GK |
| 24 | `pl-hai-24.webp` | Wilguens Paugain | DF |
| 25 | `pl-hai-25.webp` | Dominique Simon | MF |
| 26 | `pl-hai-26.webp` | Woodensky Pierre | MF |

### MAR — Morocco (Grup C)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-mar-01.webp` | Yassine Bounou | GK |
| 2 | `pl-mar-02.webp` | Achraf Hakimi | DF |
| 3 | `pl-mar-03.webp` | Noussair Mazraoui | DF |
| 4 | `pl-mar-04.webp` | Sofyan Amrabat | MF |
| 5 | `pl-mar-05.webp` | Nayef Aguerd | DF |
| 6 | `pl-mar-06.webp` | Ayyoub Bouaddi | MF |
| 7 | `pl-mar-07.webp` | Chemsdine Talbi | MF |
| 8 | `pl-mar-08.webp` | Azzedine Ounahi | MF |
| 9 | `pl-mar-09.webp` | Soufiane Rahimi | FW |
| 10 | `pl-mar-10.webp` | Brahim Díaz | FW |
| 11 | `pl-mar-11.webp` | Ismael Saibari | MF |
| 12 | `pl-mar-12.webp` | Munir Mohamedi | GK |
| 13 | `pl-mar-13.webp` | Zakaria El Ouahdi | DF |
| 14 | `pl-mar-14.webp` | Issa Diop | DF |
| 15 | `pl-mar-15.webp` | Samir El Mourabet | MF |
| 16 | `pl-mar-16.webp` | Gessime Yassine | MF |
| 17 | `pl-mar-17.webp` | Abde Ezzalzouli | FW |
| 18 | `pl-mar-18.webp` | Chadi Riad | DF |
| 19 | `pl-mar-19.webp` | Youssef Belammari | DF |
| 20 | `pl-mar-20.webp` | Ayoub El Kaabi | FW |
| 21 | `pl-mar-21.webp` | Ayoube Amaimouni | FW |
| 22 | `pl-mar-22.webp` | Ahmed Reda Tagnaouti | GK |
| 23 | `pl-mar-23.webp` | Bilal El Khannouss | MF |
| 24 | `pl-mar-24.webp` | Neil El Aynaoui | MF |
| 25 | `pl-mar-25.webp` | Redouane Halhal | DF |
| 26 | `pl-mar-26.webp` | Anass Salah-Eddine | DF |

### SCO — Scotland (Grup C)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-sco-01.webp` | Angus Gunn | GK |
| 2 | `pl-sco-02.webp` | Aaron Hickey | DF |
| 3 | `pl-sco-03.webp` | Andy Robertson | DF |
| 4 | `pl-sco-04.webp` | Scott McTominay | MF |
| 5 | `pl-sco-05.webp` | Grant Hanley | DF |
| 6 | `pl-sco-06.webp` | Kieran Tierney | DF |
| 7 | `pl-sco-07.webp` | John McGinn | MF |
| 8 | `pl-sco-08.webp` | Tyler Fletcher | MF |
| 9 | `pl-sco-09.webp` | Lyndon Dykes | FW |
| 10 | `pl-sco-10.webp` | Ché Adams | FW |
| 11 | `pl-sco-11.webp` | Ryan Christie | MF |
| 12 | `pl-sco-12.webp` | Liam Kelly | GK |
| 13 | `pl-sco-13.webp` | Jack Hendry | DF |
| 14 | `pl-sco-14.webp` | Ross Stewart | FW |
| 15 | `pl-sco-15.webp` | John Souttar | DF |
| 16 | `pl-sco-16.webp` | Dominic Hyam | DF |
| 17 | `pl-sco-17.webp` | Ben Gannon-Doak | FW |
| 18 | `pl-sco-18.webp` | George Hirst | FW |
| 19 | `pl-sco-19.webp` | Lewis Ferguson | MF |
| 20 | `pl-sco-20.webp` | Lawrence Shankland | FW |
| 21 | `pl-sco-21.webp` | Craig Gordon | GK |
| 22 | `pl-sco-22.webp` | Nathan Patterson | DF |
| 23 | `pl-sco-23.webp` | Kenny McLean | MF |
| 24 | `pl-sco-24.webp` | Anthony Ralston | DF |
| 25 | `pl-sco-25.webp` | Findlay Curtis | FW |
| 26 | `pl-sco-26.webp` | Scott McKenna | DF |

### AUS — Australia (Grup D)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-aus-01.webp` | Mathew Ryan | GK |
| 2 | `pl-aus-02.webp` | Miloš Degenek | DF |
| 3 | `pl-aus-03.webp` | Alessandro Circati | DF |
| 4 | `pl-aus-04.webp` | Jacob Italiano | DF |
| 5 | `pl-aus-05.webp` | Jordan Bos | DF |
| 6 | `pl-aus-06.webp` | Jason Geria | DF |
| 7 | `pl-aus-07.webp` | Mathew Leckie | FW |
| 8 | `pl-aus-08.webp` | Connor Metcalfe | MF |
| 9 | `pl-aus-09.webp` | Mohamed Touré | FW |
| 10 | `pl-aus-10.webp` | Ajdin Hrustic | FW |
| 11 | `pl-aus-11.webp` | Awer Mabil | FW |
| 12 | `pl-aus-12.webp` | Paul Izzo | GK |
| 13 | `pl-aus-13.webp` | Aiden O'Neill | MF |
| 14 | `pl-aus-14.webp` | Cammy Devlin | MF |
| 15 | `pl-aus-15.webp` | Kai Trewin | DF |
| 16 | `pl-aus-16.webp` | Aziz Behich | DF |
| 17 | `pl-aus-17.webp` | Nestory Irankunda | FW |
| 18 | `pl-aus-18.webp` | Patrick Beach | GK |
| 19 | `pl-aus-19.webp` | Harry Souttar | DF |
| 20 | `pl-aus-20.webp` | Cristian Volpato | FW |
| 21 | `pl-aus-21.webp` | Cameron Burgess | DF |
| 22 | `pl-aus-22.webp` | Jackson Irvine | MF |
| 23 | `pl-aus-23.webp` | Nishan Velupillay | FW |
| 24 | `pl-aus-24.webp` | Paul Okon-Engstler | MF |
| 25 | `pl-aus-25.webp` | Lucas Herrington | DF |
| 26 | `pl-aus-26.webp` | Tete Yengi | FW |

### PAR — Paraguay (Grup D)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-par-01.webp` | Gatito Fernández | GK |
| 2 | `pl-par-02.webp` | Gustavo Velázquez | DF |
| 3 | `pl-par-03.webp` | Omar Alderete | DF |
| 4 | `pl-par-04.webp` | Juan José Cáceres | DF |
| 5 | `pl-par-05.webp` | Fabián Balbuena | DF |
| 6 | `pl-par-06.webp` | Júnior Alonso | DF |
| 7 | `pl-par-07.webp` | Ramón Sosa | MF |
| 8 | `pl-par-08.webp` | Diego Gómez | MF |
| 9 | `pl-par-09.webp` | Antonio Sanabria | FW |
| 10 | `pl-par-10.webp` | Miguel Almirón | MF |
| 11 | `pl-par-11.webp` | Maurício | MF |
| 12 | `pl-par-12.webp` | Orlando Gill | GK |
| 13 | `pl-par-13.webp` | José Canale | DF |
| 14 | `pl-par-14.webp` | Andrés Cubas | MF |
| 15 | `pl-par-15.webp` | Gustavo Gómez | DF |
| 16 | `pl-par-16.webp` | Damián Bobadilla | MF |
| 17 | `pl-par-17.webp` | Kaku | FW |
| 18 | `pl-par-18.webp` | Álex Arce | FW |
| 19 | `pl-par-19.webp` | Julio Enciso | FW |
| 20 | `pl-par-20.webp` | Braian Ojeda | MF |
| 21 | `pl-par-21.webp` | Gabriel Ávalos | FW |
| 22 | `pl-par-22.webp` | Gastón Olveira | GK |
| 23 | `pl-par-23.webp` | Matías Galarza | MF |
| 24 | `pl-par-24.webp` | Gustavo Caballero | MF |
| 25 | `pl-par-25.webp` | Isidro Pitta | FW |
| 26 | `pl-par-26.webp` | Alexandro Maidana | DF |

### TUR — Türkiye (Grup D)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-tur-01.webp` | Mert Günok | GK |
| 2 | `pl-tur-02.webp` | Zeki Çelik | DF |
| 3 | `pl-tur-03.webp` | Merih Demiral | DF |
| 4 | `pl-tur-04.webp` | Çağlar Söyüncü | DF |
| 5 | `pl-tur-05.webp` | Salih Özcan | MF |
| 6 | `pl-tur-06.webp` | Orkun Kökçü | MF |
| 7 | `pl-tur-07.webp` | Kerem Aktürkoğlu | FW |
| 8 | `pl-tur-08.webp` | Arda Güler | FW |
| 9 | `pl-tur-09.webp` | Deniz Gül | FW |
| 10 | `pl-tur-10.webp` | Hakan Çalhanoğlu | MF |
| 11 | `pl-tur-11.webp` | Kenan Yıldız | FW |
| 12 | `pl-tur-12.webp` | Altay Bayındır | GK |
| 13 | `pl-tur-13.webp` | Eren Elmalı | DF |
| 14 | `pl-tur-14.webp` | Abdülkerim Bardakcı | DF |
| 15 | `pl-tur-15.webp` | Ozan Kabak | DF |
| 16 | `pl-tur-16.webp` | İsmail Yüksek | MF |
| 17 | `pl-tur-17.webp` | İrfan Can Kahveci | FW |
| 18 | `pl-tur-18.webp` | Mert Müldür | DF |
| 19 | `pl-tur-19.webp` | Yunus Akgün | FW |
| 20 | `pl-tur-20.webp` | Ferdi Kadıoğlu | DF |
| 21 | `pl-tur-21.webp` | Barış Alper Yılmaz | FW |
| 22 | `pl-tur-22.webp` | Kaan Ayhan | MF |
| 23 | `pl-tur-23.webp` | Uğurcan Çakır | GK |
| 24 | `pl-tur-24.webp` | Oğuz Aydın | FW |
| 25 | `pl-tur-25.webp` | Samet Akaydin | DF |
| 26 | `pl-tur-26.webp` | Can Uzun | FW |

### USA — United States (Grup D)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-usa-01.webp` | Matt Turner | GK |
| 2 | `pl-usa-02.webp` | Sergiño Dest | DF |
| 3 | `pl-usa-03.webp` | Chris Richards | DF |
| 4 | `pl-usa-04.webp` | Tyler Adams | MF |
| 5 | `pl-usa-05.webp` | Antonee Robinson | DF |
| 6 | `pl-usa-06.webp` | Auston Trusty | DF |
| 7 | `pl-usa-07.webp` | Giovanni Reyna | MF |
| 8 | `pl-usa-08.webp` | Weston McKennie | MF |
| 9 | `pl-usa-09.webp` | Ricardo Pepi | FW |
| 10 | `pl-usa-10.webp` | Christian Pulisic | FW |
| 11 | `pl-usa-11.webp` | Brenden Aaronson | FW |
| 12 | `pl-usa-12.webp` | Miles Robinson | DF |
| 13 | `pl-usa-13.webp` | Tim Ream | DF |
| 14 | `pl-usa-14.webp` | Sebastian Berhalter | MF |
| 15 | `pl-usa-15.webp` | Cristian Roldan | MF |
| 16 | `pl-usa-16.webp` | Alex Freeman | DF |
| 17 | `pl-usa-17.webp` | Malik Tillman | MF |
| 18 | `pl-usa-18.webp` | Max Arfsten | DF |
| 19 | `pl-usa-19.webp` | Haji Wright | FW |
| 20 | `pl-usa-20.webp` | Folarin Balogun | FW |
| 21 | `pl-usa-21.webp` | Timothy Weah | FW |
| 22 | `pl-usa-22.webp` | Mark McKenzie | DF |
| 23 | `pl-usa-23.webp` | Joe Scally | DF |
| 24 | `pl-usa-24.webp` | Matt Freese | GK |
| 25 | `pl-usa-25.webp` | Chris Brady | GK |
| 26 | `pl-usa-26.webp` | Alejandro Zendejas | FW |

### CIV — Côte d'Ivoire (Grup E)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-civ-01.webp` | Yahia Fofana | GK |
| 2 | `pl-civ-02.webp` | Ousmane Diomande | DF |
| 3 | `pl-civ-03.webp` | Ghislain Konan | DF |
| 4 | `pl-civ-04.webp` | Jean Michaël Seri | MF |
| 5 | `pl-civ-05.webp` | Wilfried Singo | DF |
| 6 | `pl-civ-06.webp` | Seko Fofana | MF |
| 7 | `pl-civ-07.webp` | Odilon Kossounou | DF |
| 8 | `pl-civ-08.webp` | Franck Kessié | MF |
| 9 | `pl-civ-09.webp` | Ange-Yoan Bonny | FW |
| 10 | `pl-civ-10.webp` | Simon Adingra | FW |
| 11 | `pl-civ-11.webp` | Yan Diomande | FW |
| 12 | `pl-civ-12.webp` | Elye Wahi | FW |
| 13 | `pl-civ-13.webp` | Christopher Opéri | DF |
| 14 | `pl-civ-14.webp` | Oumar Diakité | FW |
| 15 | `pl-civ-15.webp` | Amad Diallo | FW |
| 16 | `pl-civ-16.webp` | Mohamed Koné | GK |
| 17 | `pl-civ-17.webp` | Guéla Doué | DF |
| 18 | `pl-civ-18.webp` | Ibrahim Sangaré | MF |
| 19 | `pl-civ-19.webp` | Nicolas Pépé | FW |
| 20 | `pl-civ-20.webp` | Emmanuel Agbadou | DF |
| 21 | `pl-civ-21.webp` | Evan Ndicka | DF |
| 22 | `pl-civ-22.webp` | Evann Guessand | FW |
| 23 | `pl-civ-23.webp` | Alban Lafont | GK |
| 24 | `pl-civ-24.webp` | Bazoumana Touré | FW |
| 25 | `pl-civ-25.webp` | Parfait Guiagon | MF |
| 26 | `pl-civ-26.webp` | Christ Inao Oulaï | MF |

### CUW — Curaçao (Grup E)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-cuw-01.webp` | Eloy Room | GK |
| 2 | `pl-cuw-02.webp` | Shurandy Sambo | DF |
| 3 | `pl-cuw-03.webp` | Juriën Gaari | DF |
| 4 | `pl-cuw-04.webp` | Roshon van Eijma | DF |
| 5 | `pl-cuw-05.webp` | Sherel Floranus | DF |
| 6 | `pl-cuw-06.webp` | Godfried Roemeratoe | MF |
| 7 | `pl-cuw-07.webp` | Juninho Bacuna | MF |
| 8 | `pl-cuw-08.webp` | Livano Comenencia | MF |
| 9 | `pl-cuw-09.webp` | Jürgen Locadia | FW |
| 10 | `pl-cuw-10.webp` | Leandro Bacuna | MF |
| 11 | `pl-cuw-11.webp` | Jeremy Antonisse | FW |
| 12 | `pl-cuw-12.webp` | Sontje Hansen | FW |
| 13 | `pl-cuw-13.webp` | Tyrese Noslin | FW |
| 14 | `pl-cuw-14.webp` | Kenji Gorré | FW |
| 15 | `pl-cuw-15.webp` | Ar'jany Martha | MF |
| 16 | `pl-cuw-16.webp` | Jearl Margaritha | FW |
| 17 | `pl-cuw-17.webp` | Brandley Kuwas | FW |
| 18 | `pl-cuw-18.webp` | Armando Obispo | DF |
| 19 | `pl-cuw-19.webp` | Gervane Kastaneer | FW |
| 20 | `pl-cuw-20.webp` | Joshua Brenet | DF |
| 21 | `pl-cuw-21.webp` | Tahith Chong | MF |
| 22 | `pl-cuw-22.webp` | Kevin Felida | MF |
| 23 | `pl-cuw-23.webp` | Riechedly Bazoer | DF |
| 24 | `pl-cuw-24.webp` | Deveron Fonville | DF |
| 25 | `pl-cuw-25.webp` | Tyrick Bodak | GK |
| 26 | `pl-cuw-26.webp` | Trevor Doornbusch | GK |

### ECU — Ecuador (Grup E)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-ecu-01.webp` | Hernán Galíndez | GK |
| 2 | `pl-ecu-02.webp` | Félix Torres | DF |
| 3 | `pl-ecu-03.webp` | Piero Hincapié | DF |
| 4 | `pl-ecu-04.webp` | Joel Ordóñez | DF |
| 5 | `pl-ecu-05.webp` | Jordy Alcívar | MF |
| 6 | `pl-ecu-06.webp` | Willian Pacho | DF |
| 7 | `pl-ecu-07.webp` | Pervis Estupiñán | DF |
| 8 | `pl-ecu-08.webp` | Anthony Valencia | MF |
| 9 | `pl-ecu-09.webp` | John Yeboah | FW |
| 10 | `pl-ecu-10.webp` | Kendry Páez | MF |
| 11 | `pl-ecu-11.webp` | Kevin Rodríguez | FW |
| 12 | `pl-ecu-12.webp` | Moisés Ramírez | GK |
| 13 | `pl-ecu-13.webp` | Enner Valencia | FW |
| 14 | `pl-ecu-14.webp` | Alan Minda | MF |
| 15 | `pl-ecu-15.webp` | Pedro Vite | MF |
| 16 | `pl-ecu-16.webp` | Jordy Caicedo | FW |
| 17 | `pl-ecu-17.webp` | Ángelo Preciado | DF |
| 18 | `pl-ecu-18.webp` | Denil Castillo | MF |
| 19 | `pl-ecu-19.webp` | Gonzalo Plata | FW |
| 20 | `pl-ecu-20.webp` | Nilson Angulo | FW |
| 21 | `pl-ecu-21.webp` | Alan Franco | MF |
| 22 | `pl-ecu-22.webp` | Gonzalo Valle | GK |
| 23 | `pl-ecu-23.webp` | Moisés Caicedo | MF |
| 24 | `pl-ecu-24.webp` | Jeremy Arévalo | FW |
| 25 | `pl-ecu-25.webp` | Jackson Porozo | DF |
| 26 | `pl-ecu-26.webp` | Yaimar Medina | DF |

### GER — Germany (Grup E)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-ger-01.webp` | Manuel Neuer | GK |
| 2 | `pl-ger-02.webp` | Antonio Rüdiger | DF |
| 3 | `pl-ger-03.webp` | Waldemar Anton | DF |
| 4 | `pl-ger-04.webp` | Jonathan Tah | DF |
| 5 | `pl-ger-05.webp` | Aleksandar Pavlović | MF |
| 6 | `pl-ger-06.webp` | Joshua Kimmich | DF |
| 7 | `pl-ger-07.webp` | Kai Havertz | FW |
| 8 | `pl-ger-08.webp` | Leon Goretzka | MF |
| 9 | `pl-ger-09.webp` | Jamie Leweling | MF |
| 10 | `pl-ger-10.webp` | Jamal Musiala | MF |
| 11 | `pl-ger-11.webp` | Nick Woltemade | FW |
| 12 | `pl-ger-12.webp` | Oliver Baumann | GK |
| 13 | `pl-ger-13.webp` | Pascal Groß | MF |
| 14 | `pl-ger-14.webp` | Maximilian Beier | FW |
| 15 | `pl-ger-15.webp` | Nico Schlotterbeck | DF |
| 16 | `pl-ger-16.webp` | Angelo Stiller | MF |
| 17 | `pl-ger-17.webp` | Florian Wirtz | MF |
| 18 | `pl-ger-18.webp` | Nathaniel Brown | DF |
| 19 | `pl-ger-19.webp` | Leroy Sané | MF |
| 20 | `pl-ger-20.webp` | Nadiem Amiri | MF |
| 21 | `pl-ger-21.webp` | Alexander Nübel | GK |
| 22 | `pl-ger-22.webp` | David Raum | DF |
| 23 | `pl-ger-23.webp` | Felix Nmecha | MF |
| 24 | `pl-ger-24.webp` | Malick Thiaw | DF |
| 25 | `pl-ger-25.webp` | Assan Ouédraogo | MF |
| 26 | `pl-ger-26.webp` | Deniz Undav | FW |

### JPN — Japan (Grup F)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-jpn-01.webp` | Zion Suzuki | GK |
| 2 | `pl-jpn-02.webp` | Yukinari Sugawara | DF |
| 3 | `pl-jpn-03.webp` | Shōgo Taniguchi | DF |
| 4 | `pl-jpn-04.webp` | Kō Itakura | DF |
| 5 | `pl-jpn-05.webp` | Yūto Nagatomo | DF |
| 6 | `pl-jpn-06.webp` | Wataru Endo | MF |
| 7 | `pl-jpn-07.webp` | Ao Tanaka | MF |
| 8 | `pl-jpn-08.webp` | Takefusa Kubo | MF |
| 9 | `pl-jpn-09.webp` | Keisuke Gotō | FW |
| 10 | `pl-jpn-10.webp` | Ritsu Dōan | MF |
| 11 | `pl-jpn-11.webp` | Daizen Maeda | MF |
| 12 | `pl-jpn-12.webp` | Keisuke Ōsako | GK |
| 13 | `pl-jpn-13.webp` | Keito Nakamura | MF |
| 14 | `pl-jpn-14.webp` | Junya Itō | MF |
| 15 | `pl-jpn-15.webp` | Daichi Kamada | MF |
| 16 | `pl-jpn-16.webp` | Tsuyoshi Watanabe | DF |
| 17 | `pl-jpn-17.webp` | Yuito Suzuki | MF |
| 18 | `pl-jpn-18.webp` | Ayase Ueda | FW |
| 19 | `pl-jpn-19.webp` | Kōki Ogawa | FW |
| 20 | `pl-jpn-20.webp` | Ayumu Seko | DF |
| 21 | `pl-jpn-21.webp` | Hiroki Itō | DF |
| 22 | `pl-jpn-22.webp` | Takehiro Tomiyasu | DF |
| 23 | `pl-jpn-23.webp` | Tomoki Hayakawa | GK |
| 24 | `pl-jpn-24.webp` | Kaishū Sano | MF |
| 25 | `pl-jpn-25.webp` | Junnosuke Suzuki | DF |
| 26 | `pl-jpn-26.webp` | Kento Shiogai | FW |

### NED — Netherlands (Grup F)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-ned-01.webp` | Bart Verbruggen | GK |
| 2 | `pl-ned-02.webp` | Lutsharel Geertruida | DF |
| 3 | `pl-ned-03.webp` | Marten de Roon | MF |
| 4 | `pl-ned-04.webp` | Virgil van Dijk | DF |
| 5 | `pl-ned-05.webp` | Nathan Aké | DF |
| 6 | `pl-ned-06.webp` | Jan Paul van Hecke | DF |
| 7 | `pl-ned-07.webp` | Justin Kluivert | MF |
| 8 | `pl-ned-08.webp` | Ryan Gravenberch | MF |
| 9 | `pl-ned-09.webp` | Wout Weghorst | FW |
| 10 | `pl-ned-10.webp` | Memphis Depay | FW |
| 11 | `pl-ned-11.webp` | Cody Gakpo | FW |
| 12 | `pl-ned-12.webp` | Mats Wieffer | DF |
| 13 | `pl-ned-13.webp` | Robin Roefs | GK |
| 14 | `pl-ned-14.webp` | Tijjani Reijnders | MF |
| 15 | `pl-ned-15.webp` | Micky van de Ven | DF |
| 16 | `pl-ned-16.webp` | Guus Til | MF |
| 17 | `pl-ned-17.webp` | Noa Lang | FW |
| 18 | `pl-ned-18.webp` | Donyell Malen | FW |
| 19 | `pl-ned-19.webp` | Brian Brobbey | FW |
| 20 | `pl-ned-20.webp` | Teun Koopmeiners | MF |
| 21 | `pl-ned-21.webp` | Frenkie de Jong | MF |
| 22 | `pl-ned-22.webp` | Denzel Dumfries | DF |
| 23 | `pl-ned-23.webp` | Mark Flekken | GK |
| 24 | `pl-ned-24.webp` | Crysencio Summerville | FW |
| 25 | `pl-ned-25.webp` | Jorrel Hato | DF |
| 26 | `pl-ned-26.webp` | Quinten Timber | MF |

### SWE — Sweden (Grup F)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-swe-01.webp` | Jacob Widell Zetterström | GK |
| 2 | `pl-swe-02.webp` | Gustaf Lagerbielke | DF |
| 3 | `pl-swe-03.webp` | Victor Lindelöf | DF |
| 4 | `pl-swe-04.webp` | Isak Hien | DF |
| 5 | `pl-swe-05.webp` | Gabriel Gudmundsson | DF |
| 6 | `pl-swe-06.webp` | Herman Johansson | DF |
| 7 | `pl-swe-07.webp` | Lucas Bergvall | MF |
| 8 | `pl-swe-08.webp` | Daniel Svensson | DF |
| 9 | `pl-swe-09.webp` | Alexander Isak | FW |
| 10 | `pl-swe-10.webp` | Benjamin Nygren | MF |
| 11 | `pl-swe-11.webp` | Anthony Elanga | FW |
| 12 | `pl-swe-12.webp` | Viktor Johansson | GK |
| 13 | `pl-swe-13.webp` | Ken Sema | MF |
| 14 | `pl-swe-14.webp` | Hjalmar Ekdal | DF |
| 15 | `pl-swe-15.webp` | Carl Starfelt | DF |
| 16 | `pl-swe-16.webp` | Jesper Karlström | MF |
| 17 | `pl-swe-17.webp` | Viktor Gyökeres | FW |
| 18 | `pl-swe-18.webp` | Yasin Ayari | MF |
| 19 | `pl-swe-19.webp` | Mattias Svanberg | MF |
| 20 | `pl-swe-20.webp` | Eric Smith | DF |
| 21 | `pl-swe-21.webp` | Alexander Bernhardsson | DF |
| 22 | `pl-swe-22.webp` | Besfort Zeneli | MF |
| 23 | `pl-swe-23.webp` | Kristoffer Nordfeldt | GK |
| 24 | `pl-swe-24.webp` | Elliot Stroud | DF |
| 25 | `pl-swe-25.webp` | Gustaf Nilsson | FW |
| 26 | `pl-swe-26.webp` | Taha Ali | FW |

### TUN — Tunisia (Grup F)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-tun-01.webp` | Mouhib Chamakh | GK |
| 2 | `pl-tun-02.webp` | Ali Abdi | DF |
| 3 | `pl-tun-03.webp` | Montassar Talbi | DF |
| 4 | `pl-tun-04.webp` | Omar Rekik | DF |
| 5 | `pl-tun-05.webp` | Adem Arous | DF |
| 6 | `pl-tun-06.webp` | Dylan Bronn | DF |
| 7 | `pl-tun-07.webp` | Elias Achouri | FW |
| 8 | `pl-tun-08.webp` | Elias Saad | FW |
| 9 | `pl-tun-09.webp` | Hazem Mastouri | FW |
| 10 | `pl-tun-10.webp` | Hannibal Mejbri | MF |
| 11 | `pl-tun-11.webp` | Ismaël Gharbi | MF |
| 12 | `pl-tun-12.webp` | Mortadha Ben Ouanes | DF |
| 13 | `pl-tun-13.webp` | Rani Khedira | MF |
| 14 | `pl-tun-14.webp` | Khalil Ayari | MF |
| 15 | `pl-tun-15.webp` | Hadj Mahmoud | MF |
| 16 | `pl-tun-16.webp` | Aymen Dahmen | GK |
| 17 | `pl-tun-17.webp` | Ellyes Skhiri | MF |
| 18 | `pl-tun-18.webp` | Rayan Elloumi | FW |
| 19 | `pl-tun-19.webp` | Firas Chaouat | FW |
| 20 | `pl-tun-20.webp` | Yan Valery | DF |
| 21 | `pl-tun-21.webp` | Mohamed Amine Ben Hamida | DF |
| 22 | `pl-tun-22.webp` | Sabri Ben Hessen | GK |
| 23 | `pl-tun-23.webp` | Moutaz Neffati | DF |
| 24 | `pl-tun-24.webp` | Raed Chikhaoui | DF |
| 25 | `pl-tun-25.webp` | Anis Ben Slimane | MF |
| 26 | `pl-tun-26.webp` | Sebastian Tounekti | MF |

### BEL — Belgium (Grup G)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-bel-01.webp` | Thibaut Courtois | GK |
| 2 | `pl-bel-02.webp` | Zeno Debast | DF |
| 3 | `pl-bel-03.webp` | Arthur Theate | DF |
| 4 | `pl-bel-04.webp` | Brandon Mechele | DF |
| 5 | `pl-bel-05.webp` | Maxim De Cuyper | DF |
| 6 | `pl-bel-06.webp` | Axel Witsel | MF |
| 7 | `pl-bel-07.webp` | Kevin De Bruyne | MF |
| 8 | `pl-bel-08.webp` | Youri Tielemans | MF |
| 9 | `pl-bel-09.webp` | Romelu Lukaku | FW |
| 10 | `pl-bel-10.webp` | Leandro Trossard | FW |
| 11 | `pl-bel-11.webp` | Jérémy Doku | FW |
| 12 | `pl-bel-12.webp` | Senne Lammens | GK |
| 13 | `pl-bel-13.webp` | Mike Penders | GK |
| 14 | `pl-bel-14.webp` | Dodi Lukébakio | FW |
| 15 | `pl-bel-15.webp` | Thomas Meunier | DF |
| 16 | `pl-bel-16.webp` | Koni De Winter | DF |
| 17 | `pl-bel-17.webp` | Charles De Ketelaere | FW |
| 18 | `pl-bel-18.webp` | Joaquin Seys | DF |
| 19 | `pl-bel-19.webp` | Diego Moreira | MF |
| 20 | `pl-bel-20.webp` | Hans Vanaken | MF |
| 21 | `pl-bel-21.webp` | Timothy Castagne | DF |
| 22 | `pl-bel-22.webp` | Alexis Saelemaekers | MF |
| 23 | `pl-bel-23.webp` | Nicolas Raskin | MF |
| 24 | `pl-bel-24.webp` | Amadou Onana | MF |
| 25 | `pl-bel-25.webp` | Nathan Ngoy | DF |
| 26 | `pl-bel-26.webp` | Matias Fernandez-Pardo | FW |

### EGY — Egypt (Grup G)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-egy-01.webp` | Mohamed El Shenawy | GK |
| 2 | `pl-egy-02.webp` | Yasser Ibrahim | DF |
| 3 | `pl-egy-03.webp` | Mohamed Hany | DF |
| 4 | `pl-egy-04.webp` | Hossam Abdelmaguid | DF |
| 5 | `pl-egy-05.webp` | Ramy Rabia | DF |
| 6 | `pl-egy-06.webp` | Mohamed Abdelmonem | DF |
| 7 | `pl-egy-07.webp` | Trézéguet | FW |
| 8 | `pl-egy-08.webp` | Emam Ashour | MF |
| 9 | `pl-egy-09.webp` | Hamza Abdelkarim | FW |
| 10 | `pl-egy-10.webp` | Mohamed Salah | FW |
| 11 | `pl-egy-11.webp` | Mostafa Ziko | MF |
| 12 | `pl-egy-12.webp` | Haissem Hassan | FW |
| 13 | `pl-egy-13.webp` | Ahmed Fatouh | DF |
| 14 | `pl-egy-14.webp` | Hamdy Fathy | MF |
| 15 | `pl-egy-15.webp` | Karim Hafez | DF |
| 16 | `pl-egy-16.webp` | El Mahdy Soliman | GK |
| 17 | `pl-egy-17.webp` | Mohanad Lasheen | MF |
| 18 | `pl-egy-18.webp` | Nabil Emad | MF |
| 19 | `pl-egy-19.webp` | Marwan Attia | MF |
| 20 | `pl-egy-20.webp` | Ibrahim Adel | FW |
| 21 | `pl-egy-21.webp` | Mahmoud Saber | MF |
| 22 | `pl-egy-22.webp` | Omar Marmoush | FW |
| 23 | `pl-egy-23.webp` | Mostafa Shobeir | GK |
| 24 | `pl-egy-24.webp` | Tarek Alaa | DF |
| 25 | `pl-egy-25.webp` | Zizo | FW |
| 26 | `pl-egy-26.webp` | Mohamed Alaa | GK |

### IRN — IR Iran (Grup G)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-irn-01.webp` | Alireza Beiranvand | GK |
| 2 | `pl-irn-02.webp` | Saleh Hardani | DF |
| 3 | `pl-irn-03.webp` | Ehsan Hajsafi | DF |
| 4 | `pl-irn-04.webp` | Shojae Khalilzadeh | DF |
| 5 | `pl-irn-05.webp` | Milad Mohammadi | DF |
| 6 | `pl-irn-06.webp` | Saeid Ezatolahi | MF |
| 7 | `pl-irn-07.webp` | Alireza Jahanbakhsh | MF |
| 8 | `pl-irn-08.webp` | Mohammad Mohebi | MF |
| 9 | `pl-irn-09.webp` | Mehdi Taremi | FW |
| 10 | `pl-irn-10.webp` | Mehdi Ghayedi | FW |
| 11 | `pl-irn-11.webp` | Ali Alipour | FW |
| 12 | `pl-irn-12.webp` | Payam Niazmand | GK |
| 13 | `pl-irn-13.webp` | Hossein Kanaanizadegan | DF |
| 14 | `pl-irn-14.webp` | Saman Ghoddos | MF |
| 15 | `pl-irn-15.webp` | Rouzbeh Cheshmi | MF |
| 16 | `pl-irn-16.webp` | Mehdi Torabi | MF |
| 17 | `pl-irn-17.webp` | Aria Yousefi | DF |
| 18 | `pl-irn-18.webp` | Amirhossein Hosseinzadeh | FW |
| 19 | `pl-irn-19.webp` | Ali Nemati | DF |
| 20 | `pl-irn-20.webp` | Shahriyar Moghanlou | FW |
| 21 | `pl-irn-21.webp` | Mohammad Ghorbani | MF |
| 22 | `pl-irn-22.webp` | Hossein Hosseini | GK |
| 23 | `pl-irn-23.webp` | Ramin Rezaeian | DF |
| 24 | `pl-irn-24.webp` | Dennis Eckert | FW |
| 25 | `pl-irn-25.webp` | Danial Eiri | DF |
| 26 | `pl-irn-26.webp` | Amirmohammad Razzaghinia | MF |

### NZL — New Zealand (Grup G)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-nzl-01.webp` | Max Crocombe | GK |
| 2 | `pl-nzl-02.webp` | Tim Payne | DF |
| 3 | `pl-nzl-03.webp` | Francis de Vries | DF |
| 4 | `pl-nzl-04.webp` | Tyler Bindon | DF |
| 5 | `pl-nzl-05.webp` | Michael Boxall | DF |
| 6 | `pl-nzl-06.webp` | Joe Bell | MF |
| 7 | `pl-nzl-07.webp` | Matthew Garbett | MF |
| 8 | `pl-nzl-08.webp` | Marko Stamenić | MF |
| 9 | `pl-nzl-09.webp` | Chris Wood | FW |
| 10 | `pl-nzl-10.webp` | Sarpreet Singh | MF |
| 11 | `pl-nzl-11.webp` | Elijah Just | MF |
| 12 | `pl-nzl-12.webp` | Alex Paulsen | GK |
| 13 | `pl-nzl-13.webp` | Liberato Cacace | DF |
| 14 | `pl-nzl-14.webp` | Alex Rufer | MF |
| 15 | `pl-nzl-15.webp` | Nando Pijnaker | DF |
| 16 | `pl-nzl-16.webp` | Finn Surman | DF |
| 17 | `pl-nzl-17.webp` | Kosta Barbarouses | FW |
| 18 | `pl-nzl-18.webp` | Ben Waine | FW |
| 19 | `pl-nzl-19.webp` | Ben Old | MF |
| 20 | `pl-nzl-20.webp` | Callum McCowatt | MF |
| 21 | `pl-nzl-21.webp` | Jesse Randall | FW |
| 22 | `pl-nzl-22.webp` | Michael Woud | GK |
| 23 | `pl-nzl-23.webp` | Ryan Thomas | MF |
| 24 | `pl-nzl-24.webp` | Callan Elliot | DF |
| 25 | `pl-nzl-25.webp` | Lachlan Bayliss | MF |
| 26 | `pl-nzl-26.webp` | Tommy Smith | DF |

### CPV — Cabo Verde (Grup H)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-cpv-01.webp` | Vozinha | GK |
| 2 | `pl-cpv-02.webp` | Stopira | DF |
| 3 | `pl-cpv-03.webp` | Diney | DF |
| 4 | `pl-cpv-04.webp` | Roberto Lopes | DF |
| 5 | `pl-cpv-05.webp` | Logan Costa | DF |
| 6 | `pl-cpv-06.webp` | Kevin Pina | MF |
| 7 | `pl-cpv-07.webp` | Jovane Cabral | MF |
| 8 | `pl-cpv-08.webp` | João Paulo | MF |
| 9 | `pl-cpv-09.webp` | Gilson Benchimol | FW |
| 10 | `pl-cpv-10.webp` | Jamiro Monteiro | MF |
| 11 | `pl-cpv-11.webp` | Garry Rodrigues | MF |
| 12 | `pl-cpv-12.webp` | Márcio Rosa | GK |
| 13 | `pl-cpv-13.webp` | Sidny Lopes Cabral | DF |
| 14 | `pl-cpv-14.webp` | Deroy Duarte | MF |
| 15 | `pl-cpv-15.webp` | Laros Duarte | MF |
| 16 | `pl-cpv-16.webp` | Yannick Semedo | MF |
| 17 | `pl-cpv-17.webp` | Willy Semedo | MF |
| 18 | `pl-cpv-18.webp` | Telmo Arcanjo | MF |
| 19 | `pl-cpv-19.webp` | Dailon Livramento | FW |
| 20 | `pl-cpv-20.webp` | Ryan Mendes | FW |
| 21 | `pl-cpv-21.webp` | Nuno da Costa | MF |
| 22 | `pl-cpv-22.webp` | Steven Moreira | DF |
| 23 | `pl-cpv-23.webp` | CJ dos Santos | GK |
| 24 | `pl-cpv-24.webp` | Wagner Pina | DF |
| 25 | `pl-cpv-25.webp` | Kelvin Pires | DF |
| 26 | `pl-cpv-26.webp` | Hélio Varela | MF |

### ESP — Spain (Grup H)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-esp-01.webp` | David Raya | GK |
| 2 | `pl-esp-02.webp` | Marc Pubill | DF |
| 3 | `pl-esp-03.webp` | Álex Grimaldo | DF |
| 4 | `pl-esp-04.webp` | Eric García | DF |
| 5 | `pl-esp-05.webp` | Marcos Llorente | DF |
| 6 | `pl-esp-06.webp` | Mikel Merino | MF |
| 7 | `pl-esp-07.webp` | Ferran Torres | FW |
| 8 | `pl-esp-08.webp` | Fabián Ruiz | MF |
| 9 | `pl-esp-09.webp` | Gavi | MF |
| 10 | `pl-esp-10.webp` | Dani Olmo | FW |
| 11 | `pl-esp-11.webp` | Yéremy Pino | FW |
| 12 | `pl-esp-12.webp` | Pedro Porro | DF |
| 13 | `pl-esp-13.webp` | Joan Garcia | GK |
| 14 | `pl-esp-14.webp` | Aymeric Laporte | DF |
| 15 | `pl-esp-15.webp` | Álex Baena | MF |
| 16 | `pl-esp-16.webp` | Rodri | MF |
| 17 | `pl-esp-17.webp` | Nico Williams | FW |
| 18 | `pl-esp-18.webp` | Martín Zubimendi | MF |
| 19 | `pl-esp-19.webp` | Lamine Yamal | FW |
| 20 | `pl-esp-20.webp` | Pedri | MF |
| 21 | `pl-esp-21.webp` | Mikel Oyarzabal | FW |
| 22 | `pl-esp-22.webp` | Pau Cubarsí | DF |
| 23 | `pl-esp-23.webp` | Unai Simón | GK |
| 24 | `pl-esp-24.webp` | Marc Cucurella | DF |
| 25 | `pl-esp-25.webp` | Víctor Muñoz | FW |
| 26 | `pl-esp-26.webp` | Borja Iglesias | FW |

### KSA — Saudi Arabia (Grup H)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-ksa-01.webp` | Nawaf Al-Aqidi | GK |
| 2 | `pl-ksa-02.webp` | Ali Majrashi | DF |
| 3 | `pl-ksa-03.webp` | Ali Lajami | DF |
| 4 | `pl-ksa-04.webp` | Abdulelah Al-Amri | DF |
| 5 | `pl-ksa-05.webp` | Hassan Al-Tambakti | DF |
| 6 | `pl-ksa-06.webp` | Nasser Al-Dawsari | MF |
| 7 | `pl-ksa-07.webp` | Musab Al-Juwayr | MF |
| 8 | `pl-ksa-08.webp` | Ayman Yahya | FW |
| 9 | `pl-ksa-09.webp` | Firas Al-Buraikan | FW |
| 10 | `pl-ksa-10.webp` | Salem Al-Dawsari | FW |
| 11 | `pl-ksa-11.webp` | Saleh Al-Shehri | FW |
| 12 | `pl-ksa-12.webp` | Saud Abdulhamid | DF |
| 13 | `pl-ksa-13.webp` | Nawaf Boushal | DF |
| 14 | `pl-ksa-14.webp` | Hassan Kadesh | DF |
| 15 | `pl-ksa-15.webp` | Abdullah Al-Khaibari | MF |
| 16 | `pl-ksa-16.webp` | Ziyad Al-Johani | MF |
| 17 | `pl-ksa-17.webp` | Khalid Al-Ghannam | FW |
| 18 | `pl-ksa-18.webp` | Alaa Al-Hejji | MF |
| 19 | `pl-ksa-19.webp` | Abdullah Al-Hamdan | FW |
| 20 | `pl-ksa-20.webp` | Sultan Mandash | FW |
| 21 | `pl-ksa-21.webp` | Mohammed Al-Owais | GK |
| 22 | `pl-ksa-22.webp` | Ahmed Al-Kassar | GK |
| 23 | `pl-ksa-23.webp` | Mohamed Kanno | MF |
| 24 | `pl-ksa-24.webp` | Moteb Al-Harbi | DF |
| 25 | `pl-ksa-25.webp` | Jehad Thakri | DF |
| 26 | `pl-ksa-26.webp` | Mohammed Abu Al-Shamat | DF |

### URU — Uruguay (Grup H)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-uru-01.webp` | Sergio Rochet | GK |
| 2 | `pl-uru-02.webp` | José Giménez | DF |
| 3 | `pl-uru-03.webp` | Sebastián Cáceres | DF |
| 4 | `pl-uru-04.webp` | Ronald Araújo | DF |
| 5 | `pl-uru-05.webp` | Manuel Ugarte | MF |
| 6 | `pl-uru-06.webp` | Rodrigo Bentancur | MF |
| 7 | `pl-uru-07.webp` | Nicolás de la Cruz | MF |
| 8 | `pl-uru-08.webp` | Federico Valverde | MF |
| 9 | `pl-uru-09.webp` | Darwin Núñez | FW |
| 10 | `pl-uru-10.webp` | Giorgian de Arrascaeta | MF |
| 11 | `pl-uru-11.webp` | Facundo Pellistri | FW |
| 12 | `pl-uru-12.webp` | Santiago Mele | GK |
| 13 | `pl-uru-13.webp` | Guillermo Varela | DF |
| 14 | `pl-uru-14.webp` | Agustín Canobbio | MF |
| 15 | `pl-uru-15.webp` | Emiliano Martínez | MF |
| 16 | `pl-uru-16.webp` | Mathías Olivera | DF |
| 17 | `pl-uru-17.webp` | Matías Viña | DF |
| 18 | `pl-uru-18.webp` | Brian Rodríguez | FW |
| 19 | `pl-uru-19.webp` | Rodrigo Aguirre | FW |
| 20 | `pl-uru-20.webp` | Maximiliano Araújo | MF |
| 21 | `pl-uru-21.webp` | Federico Viñas | FW |
| 22 | `pl-uru-22.webp` | Joaquín Piquerez | MF |
| 23 | `pl-uru-23.webp` | Fernando Muslera | GK |
| 24 | `pl-uru-24.webp` | Santiago Bueno | DF |
| 25 | `pl-uru-25.webp` | Juan Manuel Sanabria | MF |
| 26 | `pl-uru-26.webp` | Rodrigo Zalazar | MF |

### FRA — France (Grup I)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-fra-01.webp` | Brice Samba | GK |
| 2 | `pl-fra-02.webp` | Malo Gusto | DF |
| 3 | `pl-fra-03.webp` | Lucas Digne | DF |
| 4 | `pl-fra-04.webp` | Dayot Upamecano | DF |
| 5 | `pl-fra-05.webp` | Jules Koundé | DF |
| 6 | `pl-fra-06.webp` | Manu Koné | MF |
| 7 | `pl-fra-07.webp` | Ousmane Dembélé | FW |
| 8 | `pl-fra-08.webp` | Aurélien Tchouaméni | MF |
| 9 | `pl-fra-09.webp` | Marcus Thuram | FW |
| 10 | `pl-fra-10.webp` | Kylian Mbappé | FW |
| 11 | `pl-fra-11.webp` | Michael Olise | FW |
| 12 | `pl-fra-12.webp` | Bradley Barcola | FW |
| 13 | `pl-fra-13.webp` | N'Golo Kanté | MF |
| 14 | `pl-fra-14.webp` | Adrien Rabiot | MF |
| 15 | `pl-fra-15.webp` | Ibrahima Konaté | DF |
| 16 | `pl-fra-16.webp` | Mike Maignan | GK |
| 17 | `pl-fra-17.webp` | William Saliba | DF |
| 18 | `pl-fra-18.webp` | Warren Zaïre-Emery | MF |
| 19 | `pl-fra-19.webp` | Théo Hernandez | DF |
| 20 | `pl-fra-20.webp` | Désiré Doué | FW |
| 21 | `pl-fra-21.webp` | Lucas Hernandez | DF |
| 22 | `pl-fra-22.webp` | Jean-Philippe Mateta | FW |
| 23 | `pl-fra-23.webp` | Robin Risser | GK |
| 24 | `pl-fra-24.webp` | Rayan Cherki | MF |
| 25 | `pl-fra-25.webp` | Maghnes Akliouche | MF |
| 26 | `pl-fra-26.webp` | Maxence Lacroix | DF |

### IRQ — Iraq (Grup I)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-irq-01.webp` | Fahad Talib | GK |
| 2 | `pl-irq-02.webp` | Rebin Sulaka | DF |
| 3 | `pl-irq-03.webp` | Hussein Ali | DF |
| 4 | `pl-irq-04.webp` | Zaid Tahseen | DF |
| 5 | `pl-irq-05.webp` | Akam Hashim | DF |
| 6 | `pl-irq-06.webp` | Manaf Younis | DF |
| 7 | `pl-irq-07.webp` | Youssef Amyn | MF |
| 8 | `pl-irq-08.webp` | Ibrahim Bayesh | MF |
| 9 | `pl-irq-09.webp` | Ali Al-Hamadi | FW |
| 10 | `pl-irq-10.webp` | Mohanad Ali | FW |
| 11 | `pl-irq-11.webp` | Ahmed Qasem | FW |
| 12 | `pl-irq-12.webp` | Jalal Hassan | GK |
| 13 | `pl-irq-13.webp` | Ali Yousif | FW |
| 14 | `pl-irq-14.webp` | Zidane Iqbal | MF |
| 15 | `pl-irq-15.webp` | Ahmed Maknzi | DF |
| 16 | `pl-irq-16.webp` | Amir Al-Ammari | MF |
| 17 | `pl-irq-17.webp` | Ali Jasim | FW |
| 18 | `pl-irq-18.webp` | Aymen Hussein | FW |
| 19 | `pl-irq-19.webp` | Kevin Yakob | MF |
| 20 | `pl-irq-20.webp` | Aimar Sher | MF |
| 21 | `pl-irq-21.webp` | Marko Farji | FW |
| 22 | `pl-irq-22.webp` | Ahmed Basil | GK |
| 23 | `pl-irq-23.webp` | Merchas Doski | DF |
| 24 | `pl-irq-24.webp` | Zaid Ismail | MF |
| 25 | `pl-irq-25.webp` | Mustafa Saadoon | DF |
| 26 | `pl-irq-26.webp` | Frans Putros | DF |

### NOR — Norway (Grup I)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-nor-01.webp` | Ørjan Nyland | GK |
| 2 | `pl-nor-02.webp` | Morten Thorsby | MF |
| 3 | `pl-nor-03.webp` | Kristoffer Ajer | DF |
| 4 | `pl-nor-04.webp` | Leo Østigård | DF |
| 5 | `pl-nor-05.webp` | David Møller Wolfe | DF |
| 6 | `pl-nor-06.webp` | Patrick Berg | MF |
| 7 | `pl-nor-07.webp` | Alexander Sørloth | FW |
| 8 | `pl-nor-08.webp` | Sander Berge | MF |
| 9 | `pl-nor-09.webp` | Erling Haaland | FW |
| 10 | `pl-nor-10.webp` | Martin Ødegaard | MF |
| 11 | `pl-nor-11.webp` | Jørgen Strand Larsen | FW |
| 12 | `pl-nor-12.webp` | Sander Tangvik | GK |
| 13 | `pl-nor-13.webp` | Egil Selvik | GK |
| 14 | `pl-nor-14.webp` | Fredrik Aursnes | MF |
| 15 | `pl-nor-15.webp` | Fredrik André Bjørkan | DF |
| 16 | `pl-nor-16.webp` | Marcus Holmgren Pedersen | DF |
| 17 | `pl-nor-17.webp` | Torbjørn Heggem | DF |
| 18 | `pl-nor-18.webp` | Kristian Thorstvedt | MF |
| 19 | `pl-nor-19.webp` | Thelo Aasgaard | MF |
| 20 | `pl-nor-20.webp` | Antonio Nusa | FW |
| 21 | `pl-nor-21.webp` | Andreas Schjelderup | MF |
| 22 | `pl-nor-22.webp` | Oscar Bobb | MF |
| 23 | `pl-nor-23.webp` | Jens Petter Hauge | MF |
| 24 | `pl-nor-24.webp` | Sondre Langås | DF |
| 25 | `pl-nor-25.webp` | Henrik Falchener | DF |
| 26 | `pl-nor-26.webp` | Julian Ryerson | FW |

### SEN — Senegal (Grup I)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-sen-01.webp` | Yehvann Diouf | GK |
| 2 | `pl-sen-02.webp` | Mamadou Sarr | DF |
| 3 | `pl-sen-03.webp` | Kalidou Koulibaly | DF |
| 4 | `pl-sen-04.webp` | Abdoulaye Seck | DF |
| 5 | `pl-sen-05.webp` | Idrissa Gueye | MF |
| 6 | `pl-sen-06.webp` | Pathé Ciss | MF |
| 7 | `pl-sen-07.webp` | Assane Diao | FW |
| 8 | `pl-sen-08.webp` | Lamine Camara | MF |
| 9 | `pl-sen-09.webp` | Bamba Dieng | FW |
| 10 | `pl-sen-10.webp` | Sadio Mané | FW |
| 11 | `pl-sen-11.webp` | Nicolas Jackson | FW |
| 12 | `pl-sen-12.webp` | Cherif Ndiaye | FW |
| 13 | `pl-sen-13.webp` | Iliman Ndiaye | FW |
| 14 | `pl-sen-14.webp` | Ismail Jakobs | DF |
| 15 | `pl-sen-15.webp` | Krépin Diatta | DF |
| 16 | `pl-sen-16.webp` | Édouard Mendy | GK |
| 17 | `pl-sen-17.webp` | Pape Matar Sarr | MF |
| 18 | `pl-sen-18.webp` | Ismaïla Sarr | FW |
| 19 | `pl-sen-19.webp` | Moussa Niakhaté | DF |
| 20 | `pl-sen-20.webp` | Ibrahim Mbaye | FW |
| 21 | `pl-sen-21.webp` | Habib Diarra | MF |
| 22 | `pl-sen-22.webp` | Bara Sapoko Ndiaye | MF |
| 23 | `pl-sen-23.webp` | Mory Diaw | GK |
| 24 | `pl-sen-24.webp` | Antoine Mendy | DF |
| 25 | `pl-sen-25.webp` | El Hadji Malick Diouf | DF |
| 26 | `pl-sen-26.webp` | Pape Gueye | MF |

### ALG — Algeria (Grup J)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-alg-01.webp` | Melvin Mastil | GK |
| 2 | `pl-alg-02.webp` | Aïssa Mandi | DF |
| 3 | `pl-alg-03.webp` | Achref Abada | DF |
| 4 | `pl-alg-04.webp` | Mohamed Amine Tougai | DF |
| 5 | `pl-alg-05.webp` | Zineddine Belaïd | DF |
| 6 | `pl-alg-06.webp` | Ramiz Zerrouki | MF |
| 7 | `pl-alg-07.webp` | Riyad Mahrez | FW |
| 8 | `pl-alg-08.webp` | Houssem Aouar | MF |
| 9 | `pl-alg-09.webp` | Amine Gouiri | FW |
| 10 | `pl-alg-10.webp` | Farès Chaïbi | MF |
| 11 | `pl-alg-11.webp` | Anis Hadj Moussa | FW |
| 12 | `pl-alg-12.webp` | Nadhir Benbouali | FW |
| 13 | `pl-alg-13.webp` | Jaouen Hadjam | DF |
| 14 | `pl-alg-14.webp` | Hicham Boudaoui | MF |
| 15 | `pl-alg-15.webp` | Rayan Aït-Nouri | DF |
| 16 | `pl-alg-16.webp` | Oussama Benbot | GK |
| 17 | `pl-alg-17.webp` | Rafik Belghali | DF |
| 18 | `pl-alg-18.webp` | Mohamed Amoura | FW |
| 19 | `pl-alg-19.webp` | Nabil Bentaleb | MF |
| 20 | `pl-alg-20.webp` | Adil Boulbina | FW |
| 21 | `pl-alg-21.webp` | Ramy Bensebaini | DF |
| 22 | `pl-alg-22.webp` | Ibrahim Maza | MF |
| 23 | `pl-alg-23.webp` | Luca Zidane | GK |
| 24 | `pl-alg-24.webp` | Yacine Titraoui | MF |
| 25 | `pl-alg-25.webp` | Farès Ghedjemis | FW |
| 26 | `pl-alg-26.webp` | Samir Chergui | DF |

### ARG — Argentina (Grup J)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-arg-01.webp` | Juan Musso | GK |
| 2 | `pl-arg-02.webp` | Marcos Nicolás Senesi Baron | MF |
| 3 | `pl-arg-03.webp` | Nicolás Tagliafico | DF |
| 4 | `pl-arg-04.webp` | Gonzalo Montiel | DF |
| 5 | `pl-arg-05.webp` | Leandro Paredes | MF |
| 6 | `pl-arg-06.webp` | Lisandro Martínez | DF |
| 7 | `pl-arg-07.webp` | Rodrigo De Paul | MF |
| 8 | `pl-arg-08.webp` | Valentín Barco | MF |
| 9 | `pl-arg-09.webp` | Julián Alvarez | FW |
| 10 | `pl-arg-10.webp` | Lionel Messi | FW |
| 11 | `pl-arg-11.webp` | Giovani Lo Celso | MF |
| 12 | `pl-arg-12.webp` | Gerónimo Rulli | GK |
| 13 | `pl-arg-13.webp` | Cristian Romero | DF |
| 14 | `pl-arg-14.webp` | Exequiel Palacios | MF |
| 15 | `pl-arg-15.webp` | Nicolás González | MF |
| 16 | `pl-arg-16.webp` | Thiago Almada | FW |
| 17 | `pl-arg-17.webp` | Giuliano Simeone | FW |
| 18 | `pl-arg-18.webp` | Nico Paz | FW |
| 19 | `pl-arg-19.webp` | Nicolás Otamendi | DF |
| 20 | `pl-arg-20.webp` | Alexis Mac Allister | MF |
| 21 | `pl-arg-21.webp` | José Manuel López | FW |
| 22 | `pl-arg-22.webp` | Lautaro Martínez | FW |
| 23 | `pl-arg-23.webp` | Emiliano Martínez | GK |
| 24 | `pl-arg-24.webp` | Enzo Fernández | MF |
| 25 | `pl-arg-25.webp` | Facundo Medina | DF |
| 26 | `pl-arg-26.webp` | Nahuel Molina | DF |

### AUT — Austria (Grup J)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-aut-01.webp` | Alexander Schlager | GK |
| 2 | `pl-aut-02.webp` | David Affengruber | DF |
| 3 | `pl-aut-03.webp` | Kevin Danso | DF |
| 4 | `pl-aut-04.webp` | Xaver Schlager | MF |
| 5 | `pl-aut-05.webp` | Stefan Posch | DF |
| 6 | `pl-aut-06.webp` | Nicolas Seiwald | MF |
| 7 | `pl-aut-07.webp` | Marko Arnautović | FW |
| 8 | `pl-aut-08.webp` | David Alaba | DF |
| 9 | `pl-aut-09.webp` | Marcel Sabitzer | MF |
| 10 | `pl-aut-10.webp` | Florian Grillitsch | MF |
| 11 | `pl-aut-11.webp` | Michael Gregoritsch | FW |
| 12 | `pl-aut-12.webp` | Florian Wiegele | GK |
| 13 | `pl-aut-13.webp` | Patrick Pentz | GK |
| 14 | `pl-aut-14.webp` | Saša Kalajdžić | FW |
| 15 | `pl-aut-15.webp` | Philipp Lienhart | DF |
| 16 | `pl-aut-16.webp` | Phillipp Mwene | DF |
| 17 | `pl-aut-17.webp` | Carney Chukwuemeka | MF |
| 18 | `pl-aut-18.webp` | Romano Schmid | MF |
| 19 | `pl-aut-19.webp` | Dejan Ljubičić | MF |
| 20 | `pl-aut-20.webp` | Konrad Laimer | MF |
| 21 | `pl-aut-21.webp` | Patrick Wimmer | FW |
| 22 | `pl-aut-22.webp` | Alexander Prass | MF |
| 23 | `pl-aut-23.webp` | Marco Friedl | DF |
| 24 | `pl-aut-24.webp` | Paul Wanner | MF |
| 25 | `pl-aut-25.webp` | Michael Svoboda | DF |
| 26 | `pl-aut-26.webp` | Alessandro Schöpf | MF |

### JOR — Jordan (Grup J)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-jor-01.webp` | Yazeed Abulaila | GK |
| 2 | `pl-jor-02.webp` | Mohammad Abu Hashish | DF |
| 3 | `pl-jor-03.webp` | Abdallah Nasib | DF |
| 4 | `pl-jor-04.webp` | Husam Abu Dahab | DF |
| 5 | `pl-jor-05.webp` | Yazan Al-Arab | DF |
| 6 | `pl-jor-06.webp` | Amer Jamous | MF |
| 7 | `pl-jor-07.webp` | Mohammad Abu Zrayq | FW |
| 8 | `pl-jor-08.webp` | Noor Al-Rawabdeh | MF |
| 9 | `pl-jor-09.webp` | Ali Olwan | FW |
| 10 | `pl-jor-10.webp` | Musa Al-Taamari | FW |
| 11 | `pl-jor-11.webp` | Odeh Al-Fakhouri | FW |
| 12 | `pl-jor-12.webp` | Nour Bani Attiah | GK |
| 13 | `pl-jor-13.webp` | Mahmoud Al-Mardi | FW |
| 14 | `pl-jor-14.webp` | Rajaei Ayed | MF |
| 15 | `pl-jor-15.webp` | Ibrahim Sadeh | MF |
| 16 | `pl-jor-16.webp` | Mo Abualnadi | DF |
| 17 | `pl-jor-17.webp` | Salim Obaid | DF |
| 18 | `pl-jor-18.webp` | Mohammad Ahmed Mohammad Taha | MF |
| 19 | `pl-jor-19.webp` | Saed Al-Rosan | DF |
| 20 | `pl-jor-20.webp` | Mohannad Abu Taha | MF |
| 21 | `pl-jor-21.webp` | Nizar Al-Rashdan | MF |
| 22 | `pl-jor-22.webp` | Abdallah Al-Fakhouri | GK |
| 23 | `pl-jor-23.webp` | Ihsan Haddad | DF |
| 24 | `pl-jor-24.webp` | Ali Azaizeh | FW |
| 25 | `pl-jor-25.webp` | Mohammad Al-Dawoud | MF |
| 26 | `pl-jor-26.webp` | Anas Badawi | DF |

### COD — Congo DR (Grup K)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-cod-01.webp` | Lionel Mpasi | GK |
| 2 | `pl-cod-02.webp` | Aaron Wan-Bissaka | DF |
| 3 | `pl-cod-03.webp` | Steve Kapuadi | DF |
| 4 | `pl-cod-04.webp` | Axel Tuanzebe | DF |
| 5 | `pl-cod-05.webp` | Dylan Batubinsika | DF |
| 6 | `pl-cod-06.webp` | Ngal'ayel Mukau | MF |
| 7 | `pl-cod-07.webp` | Nathanaël Mbuku | MF |
| 8 | `pl-cod-08.webp` | Samuel Moutoussamy | MF |
| 9 | `pl-cod-09.webp` | Brian Cipenga | FW |
| 10 | `pl-cod-10.webp` | Théo Bongonda | MF |
| 11 | `pl-cod-11.webp` | Gaël Kakuta | FW |
| 12 | `pl-cod-12.webp` | Joris Kayembe | DF |
| 13 | `pl-cod-13.webp` | Meschak Elia | FW |
| 14 | `pl-cod-14.webp` | Noah Sadiki | MF |
| 15 | `pl-cod-15.webp` | Aaron Tshibola | MF |
| 16 | `pl-cod-16.webp` | Timothy Fayulu | GK |
| 17 | `pl-cod-17.webp` | Cédric Bakambu | FW |
| 18 | `pl-cod-18.webp` | Charles Pickel | MF |
| 19 | `pl-cod-19.webp` | Fiston Mayele | FW |
| 20 | `pl-cod-20.webp` | Yoane Wissa | FW |
| 21 | `pl-cod-21.webp` | Matthieu Epolo | GK |
| 22 | `pl-cod-22.webp` | Chancel Mbemba | DF |
| 23 | `pl-cod-23.webp` | Simon Banza | FW |
| 24 | `pl-cod-24.webp` | Gédéon Kalulu | DF |
| 25 | `pl-cod-25.webp` | Edo Kayembe | MF |
| 26 | `pl-cod-26.webp` | Arthur Masuaku | DF |

### COL — Colombia (Grup K)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-col-01.webp` | David Ospina | GK |
| 2 | `pl-col-02.webp` | Daniel Muñoz | DF |
| 3 | `pl-col-03.webp` | Jhon Lucumí | DF |
| 4 | `pl-col-04.webp` | Santiago Arias | DF |
| 5 | `pl-col-05.webp` | Kevin Castaño | MF |
| 6 | `pl-col-06.webp` | Richard Ríos | MF |
| 7 | `pl-col-07.webp` | Luis Díaz | FW |
| 8 | `pl-col-08.webp` | Jorge Carrascal | MF |
| 9 | `pl-col-09.webp` | Jhon Córdoba | FW |
| 10 | `pl-col-10.webp` | James Rodríguez | MF |
| 11 | `pl-col-11.webp` | Jhon Arias | MF |
| 12 | `pl-col-12.webp` | Camilo Vargas | GK |
| 13 | `pl-col-13.webp` | Yerry Mina | DF |
| 14 | `pl-col-14.webp` | Gustavo Puerta | DF |
| 15 | `pl-col-15.webp` | Juan Portilla | MF |
| 16 | `pl-col-16.webp` | Jefferson Lerma | MF |
| 17 | `pl-col-17.webp` | Johan Mojica | DF |
| 18 | `pl-col-18.webp` | Willer Ditta | DF |
| 19 | `pl-col-19.webp` | Cucho Hernández | FW |
| 20 | `pl-col-20.webp` | Juan Fernando Quintero | MF |
| 21 | `pl-col-21.webp` | Jaminton Campaz | FW |
| 22 | `pl-col-22.webp` | Deiver Machado | DF |
| 23 | `pl-col-23.webp` | Davinson Sánchez | DF |
| 24 | `pl-col-24.webp` | Álvaro Montero | GK |
| 25 | `pl-col-25.webp` | Luis Suárez | FW |
| 26 | `pl-col-26.webp` | Andrés Gómez | FW |

### POR — Portugal (Grup K)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-por-01.webp` | Diogo Costa | GK |
| 2 | `pl-por-02.webp` | Nélson Semedo | DF |
| 3 | `pl-por-03.webp` | Rúben Dias | DF |
| 4 | `pl-por-04.webp` | Tomás Araújo | DF |
| 5 | `pl-por-05.webp` | Diogo Dalot | DF |
| 6 | `pl-por-06.webp` | Matheus Nunes | MF |
| 7 | `pl-por-07.webp` | Cristiano Ronaldo | FW |
| 8 | `pl-por-08.webp` | Bruno Fernandes | MF |
| 9 | `pl-por-09.webp` | Gonçalo Ramos | FW |
| 10 | `pl-por-10.webp` | Bernardo Silva | MF |
| 11 | `pl-por-11.webp` | João Félix | FW |
| 12 | `pl-por-12.webp` | José Sá | GK |
| 13 | `pl-por-13.webp` | Renato Veiga | DF |
| 14 | `pl-por-14.webp` | Gonçalo Inácio | DF |
| 15 | `pl-por-15.webp` | João Neves | MF |
| 16 | `pl-por-16.webp` | Francisco Trincão | FW |
| 17 | `pl-por-17.webp` | Rafael Leão | FW |
| 18 | `pl-por-18.webp` | Pedro Neto | FW |
| 19 | `pl-por-19.webp` | Gonçalo Guedes | FW |
| 20 | `pl-por-20.webp` | João Cancelo | DF |
| 21 | `pl-por-21.webp` | Rúben Neves | MF |
| 22 | `pl-por-22.webp` | Rui Silva | GK |
| 23 | `pl-por-23.webp` | Vitinha | MF |
| 24 | `pl-por-24.webp` | Samú Costa | DF |
| 25 | `pl-por-25.webp` | Nuno Mendes | DF |
| 26 | `pl-por-26.webp` | Francisco Conceição | FW |

### UZB — Uzbekistan (Grup K)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-uzb-01.webp` | Utkir Yusupov | GK |
| 2 | `pl-uzb-02.webp` | Abdukodir Khusanov | DF |
| 3 | `pl-uzb-03.webp` | Khojiakbar Alijonov | DF |
| 4 | `pl-uzb-04.webp` | Farrukh Sayfiev | DF |
| 5 | `pl-uzb-05.webp` | Rustam Ashurmatov | DF |
| 6 | `pl-uzb-06.webp` | Akmal Mozgovoy | MF |
| 7 | `pl-uzb-07.webp` | Otabek Shukurov | MF |
| 8 | `pl-uzb-08.webp` | Jamshid Iskanderov | MF |
| 9 | `pl-uzb-09.webp` | Odiljon Hamrobekov | MF |
| 10 | `pl-uzb-10.webp` | Jaloliddin Masharipov | MF |
| 11 | `pl-uzb-11.webp` | Oston Urunov | MF |
| 12 | `pl-uzb-12.webp` | Abduvohid Nematov | GK |
| 13 | `pl-uzb-13.webp` | Sherzod Nasrullaev | DF |
| 14 | `pl-uzb-14.webp` | Eldor Shomurodov | FW |
| 15 | `pl-uzb-15.webp` | Umar Eshmurodov | DF |
| 16 | `pl-uzb-16.webp` | Botirali Ergashev | GK |
| 17 | `pl-uzb-17.webp` | Dostonbek Khamdamov | MF |
| 18 | `pl-uzb-18.webp` | Abdulla Abdullaev | DF |
| 19 | `pl-uzb-19.webp` | Azizjon Ganiev | MF |
| 20 | `pl-uzb-20.webp` | Azizbek Amonov | FW |
| 21 | `pl-uzb-21.webp` | Igor Sergeev | FW |
| 22 | `pl-uzb-22.webp` | Abbosbek Fayzullaev | MF |
| 23 | `pl-uzb-23.webp` | Sherzod Esanov | MF |
| 24 | `pl-uzb-24.webp` | Bekhruz Karimov | DF |
| 25 | `pl-uzb-25.webp` | Avazbek Ulmasaliev | DF |
| 26 | `pl-uzb-26.webp` | Jakhongir Urozov | DF |

### CRO — Croatia (Grup L)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-cro-01.webp` | Dominik Livaković | GK |
| 2 | `pl-cro-02.webp` | Josip Stanišić | DF |
| 3 | `pl-cro-03.webp` | Marin Pongračić | DF |
| 4 | `pl-cro-04.webp` | Joško Gvardiol | DF |
| 5 | `pl-cro-05.webp` | Duje Ćaleta-Car | DF |
| 6 | `pl-cro-06.webp` | Josip Šutalo | DF |
| 7 | `pl-cro-07.webp` | Nikola Moro | MF |
| 8 | `pl-cro-08.webp` | Mateo Kovačić | MF |
| 9 | `pl-cro-09.webp` | Andrej Kramarić | FW |
| 10 | `pl-cro-10.webp` | Luka Modrić | MF |
| 11 | `pl-cro-11.webp` | Ante Budimir | FW |
| 12 | `pl-cro-12.webp` | Ivor Pandur | GK |
| 13 | `pl-cro-13.webp` | Nikola Vlašić | MF |
| 14 | `pl-cro-14.webp` | Ivan Perišić | FW |
| 15 | `pl-cro-15.webp` | Mario Pašalić | MF |
| 16 | `pl-cro-16.webp` | Martin Baturina | MF |
| 17 | `pl-cro-17.webp` | Petar Sučić | MF |
| 18 | `pl-cro-18.webp` | Kristijan Jakić | DF |
| 19 | `pl-cro-19.webp` | Toni Fruk | MF |
| 20 | `pl-cro-20.webp` | Igor Matanović | FW |
| 21 | `pl-cro-21.webp` | Luka Sučić | MF |
| 22 | `pl-cro-22.webp` | Luka Vušković | DF |
| 23 | `pl-cro-23.webp` | Dominik Kotarski | GK |
| 24 | `pl-cro-24.webp` | Marco Pašalić | FW |
| 25 | `pl-cro-25.webp` | Martin Erlić | DF |
| 26 | `pl-cro-26.webp` | Petar Musa | FW |

### ENG — England (Grup L)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-eng-01.webp` | Jordan Pickford | GK |
| 2 | `pl-eng-02.webp` | Ezri Konsa | DF |
| 3 | `pl-eng-03.webp` | Nico O'Reilly | DF |
| 4 | `pl-eng-04.webp` | Declan Rice | MF |
| 5 | `pl-eng-05.webp` | John Stones | DF |
| 6 | `pl-eng-06.webp` | Marc Guéhi | DF |
| 7 | `pl-eng-07.webp` | Bukayo Saka | FW |
| 8 | `pl-eng-08.webp` | Elliot Anderson | MF |
| 9 | `pl-eng-09.webp` | Harry Kane | FW |
| 10 | `pl-eng-10.webp` | Jude Bellingham | MF |
| 11 | `pl-eng-11.webp` | Marcus Rashford | FW |
| 12 | `pl-eng-12.webp` | Tino Livramento | DF |
| 13 | `pl-eng-13.webp` | Dean Henderson | GK |
| 14 | `pl-eng-14.webp` | Jordan Henderson | MF |
| 15 | `pl-eng-15.webp` | Dan Burn | DF |
| 16 | `pl-eng-16.webp` | Kobbie Mainoo | MF |
| 17 | `pl-eng-17.webp` | Morgan Rogers | MF |
| 18 | `pl-eng-18.webp` | Anthony Gordon | FW |
| 19 | `pl-eng-19.webp` | Ollie Watkins | FW |
| 20 | `pl-eng-20.webp` | Noni Madueke | FW |
| 21 | `pl-eng-21.webp` | Eberechi Eze | MF |
| 22 | `pl-eng-22.webp` | Ivan Toney | FW |
| 23 | `pl-eng-23.webp` | James Trafford | GK |
| 24 | `pl-eng-24.webp` | Reece James | DF |
| 25 | `pl-eng-25.webp` | Djed Spence | DF |
| 26 | `pl-eng-26.webp` | Jarell Quansah | DF |

### GHA — Ghana (Grup L)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-gha-01.webp` | Lawrence Ati-Zigi | GK |
| 2 | `pl-gha-02.webp` | Alidu Seidu | DF |
| 3 | `pl-gha-03.webp` | Caleb Yirenkyi | MF |
| 4 | `pl-gha-04.webp` | Jonas Adjetey | DF |
| 5 | `pl-gha-05.webp` | Thomas Partey | MF |
| 6 | `pl-gha-06.webp` | Abdul Mumin | DF |
| 7 | `pl-gha-07.webp` | Abdul Fatawu | FW |
| 8 | `pl-gha-08.webp` | Kwasi Sibo | MF |
| 9 | `pl-gha-09.webp` | Jordan Ayew | FW |
| 10 | `pl-gha-10.webp` | Brandon Thomas-Asante | FW |
| 11 | `pl-gha-11.webp` | Antoine Semenyo | MF |
| 12 | `pl-gha-12.webp` | Joseph Anang | GK |
| 13 | `pl-gha-13.webp` | Christopher Bonsu Baah | FW |
| 14 | `pl-gha-14.webp` | Gideon Mensah | DF |
| 15 | `pl-gha-15.webp` | Elisha Owusu | MF |
| 16 | `pl-gha-16.webp` | Benjamin Asare | GK |
| 17 | `pl-gha-17.webp` | Abdul Rahman Baba | DF |
| 18 | `pl-gha-18.webp` | Jerome Opoku | DF |
| 19 | `pl-gha-19.webp` | Iñaki Williams | FW |
| 20 | `pl-gha-20.webp` | Augustine Boakye | MF |
| 21 | `pl-gha-21.webp` | Kojo Peprah Oppong | DF |
| 22 | `pl-gha-22.webp` | Kamaldeen Sulemana | FW |
| 23 | `pl-gha-23.webp` | Derrick Luckassen | DF |
| 24 | `pl-gha-24.webp` | Ernest Nuamah | FW |
| 25 | `pl-gha-25.webp` | Prince Kwabena Adu | FW |
| 26 | `pl-gha-26.webp` | Marvin Senaya | DF |

### PAN — Panama (Grup L)

| No | Berkas | Pemain | Pos |
|---|---|---|---|
| 1 | `pl-pan-01.webp` | Luis Mejía | GK |
| 2 | `pl-pan-02.webp` | César Blackman | DF |
| 3 | `pl-pan-03.webp` | José Córdoba | DF |
| 4 | `pl-pan-04.webp` | Fidel Escobar | DF |
| 5 | `pl-pan-05.webp` | Edgardo Fariña | DF |
| 6 | `pl-pan-06.webp` | Cristian Martínez | MF |
| 7 | `pl-pan-07.webp` | José Luis Rodríguez | MF |
| 8 | `pl-pan-08.webp` | Adalberto Carrasquilla | MF |
| 9 | `pl-pan-09.webp` | Tomás Rodríguez | FW |
| 10 | `pl-pan-10.webp` | Ismael Díaz | MF |
| 11 | `pl-pan-11.webp` | Yoel Bárcenas | MF |
| 12 | `pl-pan-12.webp` | César Samudio | GK |
| 13 | `pl-pan-13.webp` | Jiovany Ramos | DF |
| 14 | `pl-pan-14.webp` | Carlos Harvey | DF |
| 15 | `pl-pan-15.webp` | Eric Davis | DF |
| 16 | `pl-pan-16.webp` | Andrés Andrade | DF |
| 17 | `pl-pan-17.webp` | José Fajardo | FW |
| 18 | `pl-pan-18.webp` | Cecilio Waterman | FW |
| 19 | `pl-pan-19.webp` | Alberto Quintero | MF |
| 20 | `pl-pan-20.webp` | Aníbal Godoy | MF |
| 21 | `pl-pan-21.webp` | César Yanis | MF |
| 22 | `pl-pan-22.webp` | Orlando Mosquera | GK |
| 23 | `pl-pan-23.webp` | Michael Amir Murillo | DF |
| 24 | `pl-pan-24.webp` | Azarias Londoño | FW |
| 25 | `pl-pan-25.webp` | Roderick Miller | DF |
| 26 | `pl-pan-26.webp` | Jorge Gutiérrez | DF |
