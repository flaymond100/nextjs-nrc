// components
import { Navbar, Footer } from "@/components";

export default function ImpressumPage() {
  return (
    <>
      <Navbar />
      <Impressum />
      <Footer />
    </>
  );
}

const Impressum = () => {
  return (
    <section className="mb-20 container mt-6 md:mt-10 mx-auto px-6 max-w-3xl">
      <h1 className="mb-8 text-4xl font-bold">Impressum</h1>

      <h2 className="mb-3 text-2xl font-bold">Angaben gemäß § 5 DDG</h2>
      <p className="mb-6 leading-relaxed">
        NRC INTERNATIONAL TEAM e.V. (in Gründung – i.G.)
        <br />
        Schreiberstr. 12
        <br />
        04347 Leipzig
        <br />
        Deutschland
      </p>

      <h2 className="mb-3 text-2xl font-bold">Vertreten durch den Vorstand</h2>
      <p className="mb-6 leading-relaxed">
        Der Verein wird gemäß § 26 BGB durch den Vorstand vertreten. Vertretungsberechtigt
        sind jeweils zwei Vorstandsmitglieder gemeinsam, davon eines der/die Vorsitzende
        oder der/die stellvertretende Vorsitzende.
      </p>
      <ul className="mb-6 list-disc pl-6 leading-relaxed">
        <li>Kostiantyn Garbar – Vorsitzender</li>
        <li>Lisa Pankewitz – Stellvertretende Vorsitzende</li>
        <li>Jan Wagebach – Schatzmeister</li>
        <li>Simon Schulz – Mitgliederbeauftragter</li>
        <li>Lion Bienhaus – Beauftragter für Öffentlichkeitsarbeit</li>
      </ul>

      <h2 className="mb-3 text-2xl font-bold">Kontakt</h2>
      <p className="mb-6 leading-relaxed">
        E-Mail:{" "}
        <a className="text-blue-600 hover:underline" href="mailto:info@nrc-team.com">
          info@nrc-team.com
        </a>
        <br />
        Web:{" "}
        <a
          className="text-blue-600 hover:underline"
          href="https://www.nrc-team.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.nrc-team.com
        </a>
      </p>

      <h2 className="mb-3 text-2xl font-bold">Vereinsregister</h2>
      <p className="mb-6 leading-relaxed">
        Der Verein befindet sich derzeit in Gründung. Die Eintragung in das Vereinsregister
        beim Amtsgericht Leipzig ist beantragt; die Registernummer wird nach erfolgter
        Eintragung ergänzt. Bis zur Eintragung führt der Verein den Zusatz „in Gründung
        (i.G.)".
      </p>

      <h2 className="mb-3 text-2xl font-bold">
        Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
      </h2>
      <p className="mb-6 leading-relaxed">
        Kostiantyn Garbar
        <br />
        Anschrift wie oben
      </p>

      <h2 className="mb-3 text-2xl font-bold">Haftung für Inhalte</h2>
      <p className="mb-6 leading-relaxed">
        Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
        Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
        nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
        Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
        Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
        rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
        Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
        Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
        konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
        Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
      </p>

      <h2 className="mb-3 text-2xl font-bold">Haftung für Links</h2>
      <p className="mb-6 leading-relaxed">
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
        Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
        übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
        Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
        Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
        Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der
        verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
        zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend
        entfernen.
      </p>

      <h2 className="mb-3 text-2xl font-bold">Urheberrecht</h2>
      <p className="mb-6 leading-relaxed">
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
        unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung
        und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
        schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien
        dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit
        die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
        Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
        gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam
        werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
        Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
      </p>

      <h2 className="mb-3 text-2xl font-bold">Streitschlichtung</h2>
      <p className="mb-6 leading-relaxed">
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
        bereit:{" "}
        <a
          className="text-blue-600 hover:underline"
          href="https://ec.europa.eu/consumers/odr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://ec.europa.eu/consumers/odr/
        </a>
        . Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder
        verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>
    </section>
  );
};
