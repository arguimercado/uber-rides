import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import CustomButton from "./CustomButton";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import { fetchAPI } from "@/lib/fetch";
import { PaymentProps } from "@/types/type";
import { useLocationStore } from "@/store";
import { useAuth } from "@clerk/clerk-expo";

const useHookStripe = (payment: PaymentProps) => {
   const { initPaymentSheet, presentPaymentSheet } = useStripe();
   const [success, setSuccess] = useState(false);

   const [clientSecret, setClientSecret] = useState<string>("");

   const { fullName, email, amount } = payment;

   const initializePaymentSheet = async () => {

      const { error } = await initPaymentSheet({
         merchantDisplayName: "Uber Ryder",
         intentConfiguration: {
            mode: {
               amount: 1099,
               currencyCode: "USD",
            },
            confirmHandler: async (
               paymentMethod,
               _,
               intentCreationCallback
            ) => {
               const { paymentIntent, customer } = fetchAPI("/(api)/(stripe)/create",
                  {
                     method: "POST",
                     headers: {
                        "Content-Type": "application/json",
                     },
                     body: JSON.stringify({
                        name: fullName || email.split("@")[0],
                        email: email,
                        amount: amount,
                        paymentMethodId: paymentMethod.id,
                     }),
                  }
               );

               if (paymentIntent.client_secret) {
                  const { result } = await fetchAPI("/(api)/(stripe)/pay", {
                     method: "POST",
                     headers: {
                        "Content-Type": "application/json",
                     },
                     body: JSON.stringify({
                        payment_method_id: paymentMethod.id,
                        payment_intent_id: paymentIntent.id,
                        customer_id: customer,
                        client_secret: paymentIntent.client_secret,
                     }),
                  });
						if(result.client_secret) {
							setClientSecret(result.client_secret);
							intentCreationCallback({
								clientSecret: result.client_secret,
							});
						}	
               }
            },
         },
			returnURL: 'myapp://book-ride'
      });
      
		if (!error) {
         // handle error
      }
   };

   const openPaymentSheet = async () => {
      await initializePaymentSheet();
      const { error } = await presentPaymentSheet();

      if (error) {
         // Customer canceled - you should probably do nothing.
         Alert.alert(`Error code : ${error.code}`, error.message);
      } else {
         setSuccess(true);
      }
   };

   return {
      openPaymentSheet,
      clientSecret,
   };
};

const Payment = ({
   fullName,
   email,
   amount,
   driverId,
   rideTime,
}: PaymentProps) => {
   const {
      userAddress,
      userLongitude,
      userLatitude,
      destinationLatitude,
      destinationAddress,
      destinationLongitude,
   } = useLocationStore();

   const { userId } = useAuth();

   const { openPaymentSheet, clientSecret } = useHookStripe({
      fullName: fullName,
      email: email,
      amount: amount,
      rideTime: 0,
      driverId: 0,
   });

   if (clientSecret !== "") {
		
	}

   return (
      <>
         <CustomButton
            title="Confirm Ride"
            className="my-10"
            onPress={openPaymentSheet}
         />
      </>
   );
};

export default Payment;
