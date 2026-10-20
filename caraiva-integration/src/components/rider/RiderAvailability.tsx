import { Link } from 'react-router-dom';
import '../guia/journey/journey.css';

export function RiderAvailability() {
  return <main className="cj-page"><div className="cj-container"><Link to="/guia">← Caraíva Digital</Link><section className="cj-panel"><small>ENTREGAS · EM PREPARAÇÃO</small><h1>Uma operação de entregas com cuidado.</h1><p>O despacho entre entregadores, acompanhamento e repasses ainda estão em homologação. Não há corridas ou saques reais disponíveis nesta página.</p><Link className="cj-primary" to="/demonstracao/entregas">Conhecer a demonstração visual</Link></section></div></main>;
}
