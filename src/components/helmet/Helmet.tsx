import { Helmet as ReactHelmet } from 'react-helmet-async';

interface HelmetProps {
  title: string;
}

function Helmet({ title }: HelmetProps) {
  return (
    <ReactHelmet>
      <title>{title} | MoneyMind</title>
    </ReactHelmet>
  );
}

export default Helmet;
