// Configuracion inicial
import { createAuthenticatedClient } from "@interledger/open-payments";
import fs from "fs";
import { isFinalizedGrant} from "@interledger/open-payments";
import Readline from "readline/promises"

// Importar dependencias y configurar el cliente
(async () => {
    //const privateKey = fs.readFileSync("private.key", "utf8");
    const client = await  createAuthenticatedClient({
      walletAddressUrl: 'https://ilp.interledger-test.dev/hackathon123', // direccion de la billetera remitente
      privateKey: 'private.key',
      keyId: '849627cf-f039-49e1-95b0-16f6e2b7d46e', // ID de la clave asociada
      validateResponses: false
    });

      // 1. Obtener una concesion para un pago entrante (receiver)
    const sendingWalletAddress = await client.walletAddress.get({
      url: "https://ilp.interledger-test.dev/sending"
    });

    const receivingwalletAddress = await client.walletAddress.get({
      url: "https://ilp.interledger-test.dev/receptor-in"
    })

    console.log("Wallets obtenidas:");

    console.log(sendingWalletAddress, receivingwalletAddress);

    // 2. Obtener una concesion para un pago entrante = incoming payment
    
    const incomingPaymentGrant = await client.grant.request(
    {
      url: receivingwalletAddress.authServer
    },
    {
      access_token: {
        access: [
          {
            type: 'incoming-payment',
            actions: ['create']
          },
        ],
      },
    }
  );

    
    if (!isFinalizedGrant(incomingPaymentGrant)){
      throw new Error("Se espera finalice la concesión");
    }
    console.log(incomingPaymentGrant);

    // 3. Crear un pago entrante para el receptor
    const incomingPayment = await client.incomingPayment.create(
      {
        url: receivingwalletAddress.resourceServer,
        accessToken: incomingPaymentGrant.access_token.value,
      },
      {
        walletAddress: receivingwalletAddress.id,
        incomingAmount:{
          assetCode: receivingwalletAddress.assetCode,
          assetScale: receivingwalletAddress.assetScale,
          value: "1000",
        },
      }
    );
    console.log({incomingPayment});

    // 4. Crear un concesion para una cotizacion
    const quoteGrant = await client.grant.request(
    {
      url: sendingWalletAddress.authServer,
    },
    {
      access_token: {
        access: [
          {
            type: "quote",
            actions: ["create"],
          },
        ],
      },
    }
  );


    if (!isFinalizedGrant(quoteGrant)) {
      throw new Error("Se espera finalice la concesion");
    }
      
    console.log(quoteGrant);
    
    // 5. Obtener una cotizacion para el remitente
    const quote = await client.quote.create(
      {
        url: sendingWalletAddress.resourceServer, //cambio
        accessToken: quoteGrant.access_token.value,
      },
      {
        walletAddress: sendingWalletAddress.id,
        receiver: incomingPayment.id,
        method: "ilp",
      }
    );
    console.log({quote});
  
    // 6. Obtener una concesion para un pago saliente
    const outgoingPaymentGrant = await client.grant.request(
      {
        url: sendingWalletAddress.authServer,
      },
      {
          access_token:{
          access: [
            {
              type: "outgoing-payment",
              actions: [ "create"],
              limits: {
                debitAmount: quote.debitAmount,
              },
              identifier: sendingWalletAddress.id,
            }
          ]
        },
        interact: {
          start: [ "redirect" ],
        },
      }
    );

    console.log({outgoingPaymentGrant});
    
    // 7. Continuar con la concision del pago saliente
    await Readline
    .createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    .question("Presione Enter para continuar con el pago saliente..")
    
    // 8. Finalizar la concesion del pago saliente
    const finalizedOutgoingPaymentGrant = await client.grant.continue({
      url: outgoingPaymentGrant.continue.uri,
      accessToken: outgoingPaymentGrant.continue.access_token.value,
    });
    if (!isFinalizedGrant(finalizedOutgoingPaymentGrant)){
      throw new Error("Se espera finalice la concesion");
    }
    // 9. Continuar con la cotizacion del pago saliente
    const outgoingPayment = await client.outgoingPayment.create(
      {
        url: sendingWalletAddress.resourceServer,
        accessToken: finalizedOutgoingPaymentGrant.access_token.value
      },
      {
        walletAddress: sendingWalletAddress.id,
        quoteId: quote.id,
      }
    );
    console.log({outgoingPayment});

  })();

  export async function payment (){
    //const privateKey = fs.readFileSync("private.key", "utf8");
    const client = await  createAuthenticatedClient({
      walletAddressUrl: 'https://ilp.interledger-test.dev/hackathon123', // direccion de la billetera remitente
      privateKey: 'private.key',
      keyId: '849627cf-f039-49e1-95b0-16f6e2b7d46e', // ID de la clave asociada
      validateResponses: false
    });

      // 1. Obtener una concesion para un pago entrante (receiver)
    const sendingWalletAddress = await client.walletAddress.get({
      url: "https://ilp.interledger-test.dev/sending"
    });

    const receivingwalletAddress = await client.walletAddress.get({
      url: "https://ilp.interledger-test.dev/receptor-in"
    })

    console.log("Wallets obtenidas:");

    console.log(sendingWalletAddress, receivingwalletAddress);

    // 2. Obtener una concesion para un pago entrante = incoming payment
    
    const incomingPaymentGrant = await client.grant.request(
    {
      url: receivingwalletAddress.authServer
    },
    {
      access_token: {
        access: [
          {
            type: 'incoming-payment',
            actions: ['create']
          },
        ],
      },
    }
  );

    
    if (!isFinalizedGrant(incomingPaymentGrant)){
      throw new Error("Se espera finalice la concesión");
    }
    console.log(incomingPaymentGrant);

    // 3. Crear un pago entrante para el receptor
    const incomingPayment = await client.incomingPayment.create(
      {
        url: receivingwalletAddress.resourceServer,
        accessToken: incomingPaymentGrant.access_token.value,
      },
      {
        walletAddress: receivingwalletAddress.id,
        incomingAmount:{
          assetCode: receivingwalletAddress.assetCode,
          assetScale: receivingwalletAddress.assetScale,
          value: "1000",
        },
      }
    );
    console.log({incomingPayment});

    // 4. Crear un concesion para una cotizacion
    const quoteGrant = await client.grant.request(
    {
      url: sendingWalletAddress.authServer,
    },
    {
      access_token: {
        access: [
          {
            type: "quote",
            actions: ["create"],
          },
        ],
      },
    }
  );


    if (!isFinalizedGrant(quoteGrant)) {
      throw new Error("Se espera finalice la concesion");
    }
      
    console.log(quoteGrant);
    
    // 5. Obtener una cotizacion para el remitente
    const quote = await client.quote.create(
      {
        url: sendingWalletAddress.resourceServer, //cambio
        accessToken: quoteGrant.access_token.value,
      },
      {
        walletAddress: sendingWalletAddress.id,
        receiver: incomingPayment.id,
        method: "ilp",
      }
    );
    console.log({quote});
  
    // 6. Obtener una concesion para un pago saliente
    const outgoingPaymentGrant = await client.grant.request(
      {
        url: sendingWalletAddress.authServer,
      },
      {
          access_token:{
          access: [
            {
              type: "outgoing-payment",
              actions: [ "create"],
              limits: {
                debitAmount: quote.debitAmount,
              },
              identifier: sendingWalletAddress.id,
            }
          ]
        },
        interact: {
          start: [ "redirect" ],
        },
      }
    );

    console.log({outgoingPaymentGrant});
    
    // 7. Continuar con la concision del pago saliente
    await Readline
    .createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    .question("Presione Enter para continuar con el pago saliente..")
    
    // 8. Finalizar la concesion del pago saliente
    const finalizedOutgoingPaymentGrant = await client.grant.continue({
      url: outgoingPaymentGrant.continue.uri,
      accessToken: outgoingPaymentGrant.continue.access_token.value,
    });
    if (!isFinalizedGrant(finalizedOutgoingPaymentGrant)){
      throw new Error("Se espera finalice la concesion");
    }
    // 9. Continuar con la cotizacion del pago saliente
    const outgoingPayment = await client.outgoingPayment.create(
      {
        url: sendingWalletAddress.resourceServer,
        accessToken: finalizedOutgoingPaymentGrant.access_token.value
      },
      {
        walletAddress: sendingWalletAddress.id,
        quoteId: quote.id,
      }
    );
    console.log({outgoingPayment});

    fetch('https://jsonplaceholder.typicode.com/users/1')
  .then(respuesta => console.log(respuesta))
  .catch(error => console.log(error));

  }