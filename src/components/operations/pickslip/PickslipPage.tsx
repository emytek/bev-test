import Header from './Header'
import TableSection from './TableSection'
import MidSection from './MidSection';
import FooterComponentV2 from './FooterComponent';
//import FooterSection from '../Sales/delivery-notes/PickSlip/Footer/FooterSection';

const PickSlipContent = () => {
  return (
    <div className="flex flex-col p-0 font-sans text-xs print:text-[6.5pt]" style={{ width: '297mm', minHeight: '210mm', margin: '0 auto', boxSizing: 'border-box' }}>
      <Header />
      <MidSection />
      <TableSection />
      <FooterComponentV2 />
    </div>
  );
};

export default PickSlipContent