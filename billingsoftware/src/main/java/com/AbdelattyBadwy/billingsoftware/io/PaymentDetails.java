package com.AbdelattyBadwy.billingsoftware.io;


import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentDetails {
    private String orderId;
    private String paymentId;
    private String Signature;
    private PaymentStatus paymentStatus;
    public enum PaymentStatus{
        PENDING,COMPLETEED,FAILD
    }
}
