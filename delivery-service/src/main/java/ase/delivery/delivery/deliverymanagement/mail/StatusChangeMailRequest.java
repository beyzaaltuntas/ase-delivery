package ase.delivery.delivery.deliverymanagement.mail;

import ase.delivery.delivery.deliverymanagement.model.DeliveryStatus;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

public class StatusChangeMailRequest implements MailRequest {
    private final DeliveryStatus deliveryStatus;
    private final List<String> trackingIds;

    private final String BODY_PREFIX = "Dear Customer, \n\n";
    private final String BODY_SUFFIX = "\n\nWith kind regards\nASEDelivery";
    private final String SUBJECT_PREFIX = "ASEDelivery:";
    private final Map<DeliveryStatus, String> STATUS_SUBJECT = new HashMap<>(Map.of(
            DeliveryStatus.IN_WAREHOUSE, String.format("%s Your order is being prepared", SUBJECT_PREFIX),
            DeliveryStatus.IN_DELIVERY, String.format("%s Your order is on the way", SUBJECT_PREFIX),
            DeliveryStatus.IN_PICKUPBOX, String.format("%s Your order is now deposited", SUBJECT_PREFIX),
            DeliveryStatus.DELIVERED, String.format("%s Your order is delivered", SUBJECT_PREFIX)
    ));

    private final Map<DeliveryStatus, Function<String, String>> STATUS_MAIL_BODY = new HashMap<>(Map.of(
            DeliveryStatus.IN_WAREHOUSE, (trackingNumber) -> String.format("%sYour order is being prepared in the warehouse and will be on the way soon. You can use the following tracking code to track it: %s. %s", BODY_PREFIX, trackingNumber, BODY_SUFFIX),
            DeliveryStatus.IN_DELIVERY, (__) -> String.format("%sYour order was picked up by a deliverer and is on its way to you. You will be notified when your order is deposited. %s", BODY_PREFIX, BODY_SUFFIX),
            DeliveryStatus.IN_PICKUPBOX, (__) -> String.format("%sYour order was deposited in the pick up box. Don't forget to bring your Delivery Box Card with you to open the pick-up box. %s", BODY_PREFIX, BODY_SUFFIX),
            DeliveryStatus.DELIVERED, (__) -> String.format("%sYour order was delivered. %s", BODY_PREFIX, BODY_SUFFIX)));

    public StatusChangeMailRequest(final DeliveryStatus deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
        this.trackingIds = new LinkedList<>();
    }

    public StatusChangeMailRequest(final DeliveryStatus deliveryStatus, String trackingId) {
        this.deliveryStatus = deliveryStatus;
        trackingIds = new LinkedList<>();
        this.trackingIds.add(trackingId);
    }

    public StatusChangeMailRequest(final DeliveryStatus deliveryStatus, List<String> trackingIds) {
        this.deliveryStatus = deliveryStatus;
        this.trackingIds = trackingIds;
    }

    @Override
    public String getMailSubject() {
        return STATUS_SUBJECT.get(deliveryStatus);
    }

    @Override
    public String getMailBody() {
        String t = String.join(", ", trackingIds);
        return STATUS_MAIL_BODY.get(deliveryStatus).apply(t);
    }

    @Override
    public String getBodyPrefix() {
        return this.BODY_PREFIX;
    }

    @Override
    public String getBodySuffix() {
        return this.BODY_SUFFIX;
    }
}
