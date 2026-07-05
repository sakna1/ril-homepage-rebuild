import { useState } from 'react'
import { ArrowIcon } from '../ArrowIcon'
import {
  emptyQuickInquiryFormFields,
  readQuickInquiryDraft,
  type QuickInquiryFormFields,
} from '../../contact/quickInquiryStorage'
import { ContactWhatsAppOption } from './ContactWhatsAppOption'
import { QuickInquiryForm } from './QuickInquiryForm'

export function ContactInquiryPanel() {
  const [whatsappContext, setWhatsappContext] = useState<QuickInquiryFormFields>(() => {
    return readQuickInquiryDraft() ?? emptyQuickInquiryFormFields()
  })

  return (
    <div className="contact-inquiry-panel">
      <QuickInquiryForm onFieldsChange={setWhatsappContext} />
      <ContactWhatsAppOption guestName={whatsappContext.name} guestMessage={whatsappContext.message} />
      <a className="contact-consultation-link" href="/consultation">
        Looking for a more personal starting point? Request a Private Consultation
        <ArrowIcon />
      </a>
    </div>
  )
}
