// ==========================================
// J20 — MAIN.JS
// ==========================================

// ==========================================
// GOOGLE APPS SCRIPT
// ==========================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxvFu7geiyNXc_InQn-DZK9D1z4SYteLNdh8o22jZKs53gWcX-9vR56iNtG2lGviDn6OQ/exec";


// ==========================================
// INICIO + MÚSICA
// ==========================================

const startButton =
    document.getElementById("startButton");



const music =
    document.getElementById("bgMusic");

const musicToggle =
    document.getElementById("musicToggle");

let musicStarted = false;


// ==========================================
// FADE IN
// ==========================================

function fadeIn(
    audio,
    target = 0.45,
    duration = 1400
) {

    if (!audio) {
        return;
    }

    audio.volume = 0;

    audio.play().catch(error => {

        console.log(
            "Audio bloqueado:",
            error
        );

    });

    const step =
        target / (duration / 50);

    const interval =
        setInterval(() => {

            if (
                audio.volume >=
                target
            ) {

                audio.volume =
                    target;

                clearInterval(
                    interval
                );

            } else {

                audio.volume =
                    Math.min(
                        target,
                        audio.volume + step
                    );

            }

        }, 50);

}


// ==========================================
// START BUTTON
// ==========================================

if (startButton) {

    startButton.addEventListener(
        "click",
        function () {

            if (
                !musicStarted &&
                music
            ) {

                fadeIn(
                    music,
                    0.45,
                    1400
                );

                musicStarted =
                    true;

                if (musicToggle) {

                    musicToggle.classList
                        .remove("muted");

                }

            }


            const letter =
                document.getElementById(
                    "letter"
                );


            if (letter) {

                letter.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


// ==========================================
// MUSIC TOGGLE
// ==========================================

if (musicToggle) {

    musicToggle.addEventListener(
        "click",
        async function () {

            if (!music) {
                return;
            }


            if (music.paused) {

                try {

                    await music.play();

                    musicToggle.classList
                        .remove("muted");

                } catch (error) {

                    console.log(
                        "Audio bloqueado:",
                        error
                    );

                }

            } else {

                music.pause();

                musicToggle.classList
                    .add("muted");

            }

        }
    );

}


// ==========================================
// RSVP
// ==========================================

const rsvpForm =
    document.getElementById("rsvpForm");

const rsvpSuccess =
    document.getElementById("rsvpSuccess");

const rsvpStatus =
    document.getElementById("rsvpStatus");

const rsvpMessageTitle =
    document.getElementById("rsvpMessageTitle");

const rsvpMessageText =
    document.getElementById("rsvpMessageText");

const rsvpNextButton =
    document.getElementById("rsvpNextButton");


// ==========================================
// CONFIRMAR ASISTENCIA
// ==========================================

if (rsvpForm) {

    rsvpForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            console.log("RSVP BUTTON FUNCIONA");


            const guestName =
                document
                    .getElementById("guestName")
                    ?.value
                    .trim();


            const attendance =
                document.querySelector(
                    'input[name="attendance"]:checked'
                )?.value;


            console.log({
                guestName,
                attendance
            });


            // ==================================
            // VALIDAR DATOS
            // ==================================

            if (
                !guestName ||
                !attendance
            ) {

                alert(
                    "Please enter your name and select an answer."
                );

                return;

            }


            // ==================================
            // NO ASISTE
            // ==================================

            if (
                attendance === "NO"
            ) {

                // Guardar información
                localStorage.setItem(
                    "guestName",
                    guestName
                );

                localStorage.setItem(
                    "attendance",
                    "NO"
                );

                localStorage.removeItem(
                    "assignedMission"
                );


                // Mostrar respuesta INMEDIATAMENTE
                rsvpStatus.textContent =
                    "THANK YOU";


                rsvpMessageTitle.innerHTML =
                    `
                    WE'LL MISS
                    <span>YOU.</span>
                    `;


                rsvpMessageText.textContent =
                    "Thank you for letting us know. We hope to see you another time.";


                rsvpNextButton.textContent =
                    "COUNTDOWN →";


                rsvpNextButton.dataset.destination =
                    "countdown";


                rsvpForm.hidden =
                    true;


                rsvpSuccess.hidden =
                    false;


                // Enviar a Google DESPUÉS
                sendToGoogle({

                    type:
                        "RSVP",

                    name:
                        guestName,

                    attendance:
                        "NO",

                    missionTitle:
                        "",

                    missionId:
                        ""

                });


                return;

            }


            // ==================================
            // SÍ ASISTE
            // ==================================

            const mission =
                assignMission();


            // Guardar información
            localStorage.setItem(
                "guestName",
                guestName
            );


            localStorage.setItem(
                "attendance",
                "YES"
            );


            localStorage.setItem(
                "assignedMission",
                JSON.stringify(
                    mission
                )
            );


            console.log(
                "Misión asignada:",
                mission
            );


            // ==================================
            // MOSTRAR CONFIRMACIÓN
            // ==================================

            rsvpStatus.textContent =
                "ACCESS GRANTED";


            rsvpMessageTitle.innerHTML =
                `
                SEE YOU
                <span>THERE.</span>
                `;


            rsvpMessageText.textContent =
                "Your place has been reserved. Your classified file is waiting for you.";


            rsvpNextButton.textContent =
                "OPEN YOUR FILE →";


            rsvpNextButton.dataset.destination =
                "confidential";


            rsvpForm.hidden =
                true;


            rsvpSuccess.hidden =
                false;


            // ==================================
            // ENVIAR A GOOGLE
            // ==================================

            sendToGoogle({

                type:
                    "RSVP",

                name:
                    guestName,

                attendance:
                    "YES",

                missionTitle:
                    mission.title,

                missionId:
                    mission.id

            });

        }
    );

}


// ==========================================
// NAVEGACIÓN DEL RSVP
// ==========================================

if (rsvpNextButton) {

    rsvpNextButton.addEventListener(
        "click",
        function () {

            const destination =
                rsvpNextButton.dataset
                    .destination;


            // ==================================
            // CONFIDENTIAL
            // ==================================

            if (
                destination ===
                "confidential"
            ) {

                const confidential =
                    document.getElementById(
                        "confidential"
                    );


                if (confidential) {

                    confidential.scrollIntoView({
                        behavior:
                            "smooth"
                    });

                }

                return;

            }


            // ==================================
            // COUNTDOWN
            // ==================================

            if (
                destination ===
                "countdown"
            ) {

                const countdown =
                    document.getElementById(
                        "countdown"
                    );


                if (countdown) {

                    countdown.scrollIntoView({
                        behavior:
                            "smooth"
                    });

                }

            }

        }
    );

}


// ==========================================
// GOOGLE APPS SCRIPT
// ==========================================

function sendToGoogle(data) {

    console.log(
        "Enviando a Google:",
        data
    );


    fetch(
        GOOGLE_SCRIPT_URL,
        {

            method:
                "POST",

            mode:
                "no-cors",

            headers: {

                "Content-Type":
                    "text/plain;charset=utf-8"

            },

            body:
                JSON.stringify(data)

        }
    )
    .then(() => {

        console.log(
            "Datos enviados a Google Apps Script."
        );

    })
    .catch(error => {

        console.error(
            "Error enviando datos:",
            error
        );

    });

}


// ==========================================
// ASIGNAR MISIÓN
// ==========================================

function assignMission() {

    const usedMissions =
        JSON.parse(
            localStorage.getItem(
                "usedMissions"
            )
        ) || [];


    const availableMissions =
        secretMissions.filter(
            mission =>
                !usedMissions.includes(
                    mission.id
                )
        );


    let mission;


    if (
        availableMissions.length > 0
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                availableMissions.length
            );


        mission =
            availableMissions[
                randomIndex
            ];

    } else {

        const randomIndex =
            Math.floor(
                Math.random() *
                secretMissions.length
            );


        mission =
            secretMissions[
                randomIndex
            ];

    }


    if (
        !usedMissions.includes(
            mission.id
        )
    ) {

        usedMissions.push(
            mission.id
        );


        localStorage.setItem(
            "usedMissions",
            JSON.stringify(
                usedMissions
            )
        );

    }


    return mission;

}

// ==========================================
// SECRET MISSIONS — ISSUE 20
// ==========================================

const secretMissions = [

    {
        id: 1,
        type: "SECRET",
        title: "THE CODE",
        text:
            'Durante la fiesta, consigue que alguien diga naturalmente la palabra "ICONIC". No puedes pedirle que la diga directamente.'
    },

    {
        id: 2,
        type: "SOCIAL",
        title: "THE INFORMANT",
        text:
            "Encuentra a alguien que conozca a Jenny desde hace varios años y consigue que te cuente una historia sobre ella que probablemente no conozcas. No le digas que es parte de una misión."
    },

    {
        id: 3,
        type: "PHOTO",
        title: "THE PAPARAZZI",
        text:
            "Consigue fotografías espontáneas de los invitados conversando, bailando, riéndose o disfrutando de la fiesta. Las fotos deben parecer tomadas por un paparazzi."
    },

    {
        id: 4,
        type: "SECRET",
        title: "THE CHALLENGE",
        text:
            "Inventa un reto rápido y consigue que otro invitado lo acepte. No le digas que es parte de una misión."
    },

    {
        id: 5,
        type: "SOCIAL",
        title: "THE HOST",
        text:
            "Prepara una bebida para alguien más y sorpréndelo con ella. Brinden juntos antes de continuar tu misión."
    },

    {
        id: 6,
        type: "SECRET",
        title: "SECRET MESSAGE",
        text:
            "Consigue que tres personas diferentes te digan una palabra que describa a Jenny. No les expliques por qué. Memoriza las tres palabras."
    },

    {
        id: 7,
        type: "SECRET",
        title: "THE RUMOR",
        text:
            "Durante la noche, consigue que tres personas diferentes te digan cuál creen que es la canción que más representa a Jenny. No reveles que estás comparando respuestas."
    },

    {
        id: 8,
        type: "PHOTO",
        title: "THE MATCH",
        text:
            "Encuentra a alguien cuyo outfit combine contigo. Puede ser por el color, los accesorios, el estilo o simplemente porque ambos tienen energía Y2K. Consigan una fotografía juntos."
    },

    {
        id: 9,
        type: "Y2K",
        title: "2000s HIT",
        text:
            "Consigue que alguien baile contigo una canción de los 2000. No le digas que es parte de una misión."
    },

    {
        id: 10,
        type: "PHOTO",
        title: "THE INTRODUCTION",
        text:
            'Encuentra a dos personas que creas que no se conocen y preséntalas. Después, convéncelas de hacer una fotografía como si fueran la portada de una revista. Solo diles: "Trust me."'
    },

    {
        id: 11,
        type: "SECRET",
        title: "THE SECRET FAVOR",
        text:
            "Consigue que alguien te ayude con algo pequeño durante la fiesta sin decirle que forma parte de tu misión. Puede ser conseguirte algo, presentarte a alguien, ayudarte a elegir una canción o tomarte una foto."
    },

    {
        id: 12,
        type: "JENNY",
        title: "THE LAST FILE",
        text:
            'Antes de que termine la noche, encuentra a Jenny y dile: "So... how does it feel to be 20?" Esta misión debe completarse antes de que termine la fiesta.'
    },

    {
        id: 13,
        type: "SOCIAL",
        title: "THE DOUBLE",
        text:
            "Encuentra a alguien con quien tengas algo en común y descubre qué es. Puede ser una canción, película, artista, hobby o cualquier otra cosa."
    },

    {
        id: 14,
        type: "PHOTO",
        title: "THE FLASH",
        text:
            "Consigue una fotografía con tres personas diferentes que no hayan posado juntas antes. La foto debe tener energía de fiesta Y2K."
    },

    {
        id: 15,
        type: "SECRET",
        title: "THE FINAL MOVE",
        text:
            "Elige a un invitado y consigue que haga contigo un pequeño reto inventado por ti. No puedes decirle que tienes una misión secreta."
    }

];


// ==========================================
// CONFIDENTIAL — ABRIR MISIÓN
// ==========================================

const openMission =
    document.getElementById(
        "openMission"
    );

const missionEnvelope =
    document.getElementById(
        "missionEnvelope"
    );

const missionFile =
    document.getElementById(
        "missionFile"
    );

const missionText =
    document.getElementById(
        "missionText"
    );

const missionNumber =
    document.querySelector(
        ".mission-number"
    );

const missionTitle =
    document.querySelector(
        ".mission-file h3"
    );


if (openMission) {

    openMission.addEventListener(
        "click",
        function () {

            const savedMission =
                localStorage.getItem(
                    "assignedMission"
                );


            if (!savedMission) {

                console.log(
                    "No hay una misión asignada."
                );

                return;

            }


            const mission =
                JSON.parse(
                    savedMission
                );


            if (missionNumber) {

                missionNumber.textContent =
                    `MISSION ${
                        String(
                            mission.id
                        ).padStart(
                            2,
                            "0"
                        )
                    }`;

            }


            if (missionTitle) {

                missionTitle.textContent =
                    mission.title;

            }


            if (missionText) {

                missionText.textContent =
                    mission.text;

            }


            if (missionEnvelope) {

                missionEnvelope.classList.add(
                    "opened"
                );

            }


            setTimeout(
                function () {

                    if (
                        missionEnvelope
                    ) {

                        missionEnvelope.style.display =
                            "none";

                    }


                    if (
                        missionFile
                    ) {

                        missionFile.hidden =
                            false;

                    }

                },
                500
            );

        }
    );

}


// ==========================================
// COUNTDOWN
// ==========================================

const eventDate =
    new Date(
        "August 15, 2026 20:00:00 GMT-0500"
    ).getTime();


function updateCountdown() {

    const now =
        new Date().getTime();


    const difference =
        eventDate - now;


    if (
        difference <= 0
    ) {

        const days =
            document.getElementById(
                "days"
            );

        const hours =
            document.getElementById(
                "hours"
            );

        const minutes =
            document.getElementById(
                "minutes"
            );

        const seconds =
            document.getElementById(
                "seconds"
            );


        if (days) {
            days.textContent = "00";
        }

        if (hours) {
            hours.textContent = "00";
        }

        if (minutes) {
            minutes.textContent = "00";
        }

        if (seconds) {
            seconds.textContent = "00";
        }


        return;

    }


    const days =
        Math.floor(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    const hours =
        Math.floor(
            (
                difference /
                (
                    1000 *
                    60 *
                    60
                )
            ) % 24
        );


    const minutes =
        Math.floor(
            (
                difference /
                (
                    1000 *
                    60
                )
            ) % 60
        );


    const seconds =
        Math.floor(
            (
                difference /
                1000
            ) % 60
        );


    const daysElement =
        document.getElementById(
            "days"
        );

    const hoursElement =
        document.getElementById(
            "hours"
        );

    const minutesElement =
        document.getElementById(
            "minutes"
        );

    const secondsElement =
        document.getElementById(
            "seconds"
        );


    if (daysElement) {

        daysElement.textContent =
            String(days)
                .padStart(
                    2,
                    "0"
                );

    }


    if (hoursElement) {

        hoursElement.textContent =
            String(hours)
                .padStart(
                    2,
                    "0"
                );

    }


    if (minutesElement) {

        minutesElement.textContent =
            String(minutes)
                .padStart(
                    2,
                    "0"
                );

    }


    if (secondsElement) {

        secondsElement.textContent =
            String(seconds)
                .padStart(
                    2,
                    "0"
                );

    }

}


updateCountdown();


setInterval(
    updateCountdown,
    1000
);


// ==========================================
// RESTAURAR ESTADO DEL INVITADO
// ==========================================

// Si el invitado ya confirmó anteriormente,
// conservamos sus datos en localStorage.

const savedGuestName =
    localStorage.getItem(
        "guestName"
    );

const savedAttendance =
    localStorage.getItem(
        "attendance"
    );


if (
    savedGuestName &&
    savedAttendance === "YES"
) {

    console.log(
        "Invitado confirmado:",
        savedGuestName
    );

}


// ==========================================
// FIN DEL MAIN.JS
// ==========================================