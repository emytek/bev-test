import DeliveryNoteHeader from './Header'
import DeliveryContent from './DeliveryContent'
import MidSection from './Midsection'


const DeliveryNote = () => {
  return (
    <div className="flex flex-col p-0 font-sans text-xs print:text-[6.5pt]" style={{ width: '297mm', minHeight: '210mm', margin: '0 auto', boxSizing: 'border-box' }}>
      <DeliveryNoteHeader />
      <MidSection />
      <DeliveryContent />
    </div>
  )
}

export default DeliveryNote