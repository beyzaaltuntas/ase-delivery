package ase.delivery.delivery.deliverymanagement.mail;

public interface MailRequest {

    String getMailSubject();

    String getMailBody();

    String getBodyPrefix();

    String getBodySuffix();
}
