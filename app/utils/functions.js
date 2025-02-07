import TgIcon from "../../public/contactIcons/TgIcon.png";
import MailIcon from "../../public/contactIcons/MailIcon.png";
import PhoneIcon from "../../public/contactIcons/PhoneIcon.png";
import WhatsAppIcon from "../../public/contactIcons/WhatsappIcon.png";

export function getIconSrc(contactType) {
  switch (contactType) {
    case "Email":
      return MailIcon;
    case "SMS":
      return PhoneIcon;
    case "Telegram":
      return TgIcon;
    case "WA":
      return WhatsAppIcon;
    default:
      return MailIcon;
  }
}
