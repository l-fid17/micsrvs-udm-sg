import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@sg-udemy-gittix/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { title, price, version } = data;
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new NotFoundError();
    }
    ticket.set({ title, price, version });
    await ticket.save();

    msg.ack();
  }
}
