import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

function Scan() {

    const navigate = useNavigate();

    useEffect(() => {

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: 250
            },
            false
        );


        scanner.render(
            (decodedText) => {

                console.log("QR Result:", decodedText);


                // URL se album code nikalna

                if(decodedText.includes("/public/")){

                    const albumCode = decodedText.split("/public/")[1];

                    navigate(`/public/${albumCode}`);

                }
                else{

                    alert("Invalid Album QR");

                }


                scanner.clear();

            },
            (error) => {
                // scanning errors ignore
            }
        );


        return () => {
            scanner.clear().catch(() => {});
        };


    }, []);


    return (

        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center">

            <h1 className="text-3xl font-bold mb-6">
                Scan Memory Album
            </h1>


            <div 
                id="reader"
                className="bg-white rounded-xl p-4"
            ></div>


            <p className="mt-5 text-zinc-400">
                Scan the QR code on your album
            </p>


        </div>

    );

}

export default Scan;