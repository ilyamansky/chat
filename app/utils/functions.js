import TgIcon from "../../public/contactIcons/TgIcon.png";
import MailIcon from "../../public/contactIcons/MailIcon.png";
import PhoneIcon from "../../public/contactIcons/PhoneIcon.png";
import WhatsAppIcon from "../../public/contactIcons/WhatsappIcon.png";

export function getIconSrc(contactType) {
  switch (contactType) {
    case "email":
      return MailIcon;
    case "phone":
      return PhoneIcon;
    case "telegram":
      return TgIcon;
    case "whatsapp":
      return WhatsAppIcon;
    default:
      return MailIcon;
  }
}
