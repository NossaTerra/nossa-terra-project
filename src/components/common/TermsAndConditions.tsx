import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

export function TermsAndConditionsLink() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="font-poppins-900 px-0 text-headingPrimary"
          variant="link"
        >
          termos e condições
        </Button>
      </DialogTrigger>
      <DialogContent isFullWidth>
        <DialogHeader>
          <DialogTitle>Termos e condições</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <article className="prose max-h-[80vh] max-w-none overflow-y-scroll px-4 text-justify">
          <PrivacyPolicyContent />
        </article>
      </DialogContent>
    </Dialog>
  );
}

const PrivacyPolicyContent = () => {
  return (
    <div>
      <h2>Termos e Condições de Uso</h2>
      <p>
        <strong>Última atualização:</strong> 31 de março de 2024
      </p>
      <p>
        Por favor, leia atentamente estes Termos e Condições de Uso ("Termos",
        "Termos de Uso") antes de utilizar o nosso Serviço.
      </p>
      <p>
        Estes Termos regem o uso do nosso Serviço e a relação entre você e a
        Empresa. Ao acessar ou utilizar o Serviço, você concorda em ficar
        vinculado a estes Termos. Se você discordar de qualquer parte dos
        termos, não poderá acessar o Serviço.
      </p>
      <h2>Interpretação e Definições</h2>
      <h3>Interpretação</h3>
      <p>
        As palavras cuja letra inicial é maiúscula têm significados definidos
        nas seguintes condições. As seguintes definições terão o mesmo
        significado independentemente de aparecerem no singular ou no plural.
      </p>
      <h3>Definições</h3>
      <p>Para os fins destes Termos e Condições de Uso:</p>
      <ul>
        <li>
          <strong>Conta:</strong> significa uma conta única criada para você
          acessar nosso Serviço ou partes do nosso Serviço.
        </li>
        <li>
          <strong>Afiliado:</strong> significa uma entidade que controla, é
          controlada por ou está sob controle comum com uma parte, onde
          "controle" significa a propriedade de 50% ou mais das ações,
          participação acionária ou outros valores mobiliários com direito a
          voto para a eleição de diretores ou outra autoridade gerencial.
        </li>
        <li>
          <strong>Empresa:</strong> (referida como "a Empresa", "Nós", "Nosso"
          ou "Nossos" neste Contrato) refere-se a Nossa Terra, n/A.
        </li>
        <li>
          <strong>Cookies:</strong> são arquivos pequenos que são colocados em
          seu computador, dispositivo móvel ou qualquer outro dispositivo por um
          site, contendo os detalhes de seu histórico de navegação naquele site
          entre seus muitos usos.
        </li>
        <li>
          <strong>País:</strong> refere-se a: Brasil.
        </li>
        <li>
          <strong>Dispositivo:</strong> significa qualquer dispositivo que possa
          acessar o Serviço, como um computador, um celular ou um tablet
          digital.
        </li>
        <li>
          <strong>Dados Pessoais:</strong> são quaisquer informações que se
          refiram a um indivíduo identificado ou identificável.
        </li>
        <li>
          <strong>Serviço:</strong> refere-se ao Website.
        </li>
        <li>
          <strong>Prestador de Serviços:</strong> significa qualquer pessoa
          física ou jurídica que processe os dados em nome da Empresa. Refere-se
          a empresas ou indivíduos de terceiros empregados pela Empresa para
          facilitar o Serviço, fornecer o Serviço em nome da Empresa, realizar
          serviços relacionados ao Serviço ou ajudar a Empresa na análise de
          como o Serviço é utilizado.
        </li>
        <li>
          <strong>Serviço de Mídia Social de Terceiros:</strong> refere-se a
          qualquer website ou qualquer website de rede social através do qual um
          Usuário pode fazer login ou criar uma conta para usar o Serviço.
        </li>
        <li>
          <strong>Dados de Uso:</strong> referem-se a dados coletados
          automaticamente, gerados pelo uso do Serviço ou pela infraestrutura do
          Serviço em si (por exemplo, a duração de uma visita à página).
        </li>
        <li>
          <strong>Website:</strong> refere-se a nossaterra, acessível em
          www.nossaterra.com
        </li>
        <li>
          <strong>Você:</strong> significa o indivíduo que acessa ou usa o
          Serviço, ou a empresa ou outra entidade legal em nome da qual tal
          indivíduo acessa ou usa o Serviço, conforme aplicável.
        </li>
      </ul>
      <h2>Coleta e Uso dos Seus Dados Pessoais</h2>
      <h3>Tipos de Dados Coletados</h3>
      <h4>Dados Pessoais</h4>
      <p>
        Ao usar Nosso Serviço, podemos solicitar que você nos forneça certas
        informações pessoalmente identificáveis que podem ser usadas para
        contatá-lo ou identificá-lo. As informações pessoalmente identificáveis
        podem incluir, mas não estão limitadas a:
      </p>
      <ul>
        <li>Endereço de e-mail</li>
        <li>Nome e sobrenome</li>
        <li>Número de telefone</li>
        <li>Endereço, Estado, Província, CEP, Cidade</li>
        <li>Dados de uso</li>
      </ul>
      <h4>Dados de Uso</h4>
      <p>Os dados de uso são coletados automaticamente ao usar o Serviço.</p>
      <p>
        Os dados de uso podem incluir informações como o endereço IP do seu
        dispositivo (por exemplo, endereço IP), tipo de navegador, versão do
        navegador, as páginas do nosso Serviço que você visita, o tempo e a data
        de sua visita, o tempo gasto nessas páginas, identificadores exclusivos
        de dispositivos e outros dados de diagnóstico.
      </p>
      <p>
        Ao acessar o Serviço por meio de um dispositivo móvel, podemos coletar
        certas informações automaticamente, incluindo, mas não se limitando a, o
        tipo de dispositivo móvel que você usa, o ID exclusivo do seu
        dispositivo móvel, o endereço IP do seu dispositivo móvel, seu sistema
        operacional móvel, o tipo de navegador de Internet móvel que você usa,
        identificadores exclusivos de dispositivos e outros dados de
        diagnóstico.
      </p>
      <p>
        Também podemos coletar informações que o seu navegador envia sempre que
        você visita nosso Serviço ou quando você acessa o Serviço por ou através
        de um dispositivo móvel.
      </p>
      <h4>Informações de Serviços de Mídia Social de Terceiros</h4>
      <p>
        A Empresa permite que você crie uma conta e faça login para usar o
        Serviço através dos seguintes Serviços de Mídia Social de Terceiros:
      </p>
      <ul>
        <li>Google</li>
        <li>Instagram</li>
      </ul>
      <p>
        Se você decidir se registrar ou conceder-nos acesso a um Serviço de
        Mídia Social de Terceiros, poderemos coletar dados pessoais que já estão
        associados à sua conta de Serviço de Mídia Social de Terceiros, como seu
        nome, seu endereço de e-mail, suas atividades ou sua lista de contatos
        associada a essa conta.
      </p>
      <p>
        Você também pode ter a opção de compartilhar informações adicionais com
        a Empresa por meio da sua conta de Serviço de Mídia Social de Terceiros.
        Se você optar por fornecer tais informações e dados pessoais, durante o
        registro ou de outra forma, você está dando permissão à Empresa para
        usá-los, compartilhá-los e armazená-los de acordo com esta Política de
        Privacidade.
      </p>
      <h4>Tecnologias de Rastreamento e Cookies</h4>
      <p>
        Usamos Cookies e tecnologias de rastreamento semelhantes para rastrear a
        atividade em nosso Serviço e armazenar certas informações. As
        tecnologias de rastreamento usadas são balizas, tags e scripts para
        coletar e rastrear informações e para melhorar e analisar nosso Serviço.
      </p>
      <p>As tecnologias que usamos podem incluir:</p>
      <ul>
        <li>
          Cookies ou Cookies do Navegador. Um cookie é um pequeno arquivo
          colocado em seu dispositivo. Você pode instruir seu navegador a
          recusar todos os cookies ou a indicar quando um cookie está sendo
          enviado. No entanto, se você não aceitar cookies, talvez não consiga
          usar algumas partes do nosso Serviço. A menos que você tenha ajustado
          suas configurações de navegador para que recuse cookies, nosso Serviço
          pode usar cookies.
        </li>
        <li>
          Web Beacons. Certas seções do nosso Serviço e nossos e-mails podem
          conter pequenos arquivos eletrônicos conhecidos como web beacons
          (também referidos como gifs claros, tags de pixel e gifs de pixel
          único) que permitem à Empresa, por exemplo, contar usuários que
          visitaram essas páginas ou abriram um e-mail e para outras
          estatísticas de website relacionadas (por exemplo, registrando a
          popularidade de uma determinada seção e verificando a integridade do
          sistema e do servidor).
        </li>
      </ul>
      <p>
        Os cookies podem ser "Persistentes" ou "de Sessão". Os cookies
        persistentes permanecem em seu computador pessoal ou dispositivo móvel
        quando você se desconecta, enquanto os cookies de sessão são excluídos
        assim que você fecha seu navegador da web.
      </p>
      <h2>Uso dos Seus Dados Pessoais</h2>
      <h2>A Empresa pode usar Dados Pessoais para os seguintes fins:</h2>
      <p>
        Para fornecer e manter nosso Serviço, incluindo monitorar o uso do nosso
        Serviço.
      </p>
      <p>
        Para gerenciar sua Conta: para gerenciar seu registro como usuário do
        Serviço. Os Dados Pessoais que você fornece podem dar a você acesso a
        diferentes funcionalidades do Serviço que estão disponíveis para você
        como usuário registrado.
      </p>
      <p>
        Para o desempenho de um contrato: o desenvolvimento, conformidade e
        execução do contrato de compra dos produtos, itens ou serviços que você
        comprou ou de qualquer outro contrato conosco através do Serviço.
      </p>
      <p>
        Para entrar em contato com você: Para entrar em contato com você por
        e-mail, chamadas telefônicas, SMS ou outras formas equivalentes de
        comunicação eletrônica, como notificações push de aplicativos móveis
        sobre atualizações ou comunicações informativas relacionadas às
        funcionalidades, produtos ou serviços contratados, incluindo as
        atualizações de segurança, quando necessário ou razoável para sua
        implementação.
      </p>
      <p>
        Para fornecer a você notícias, ofertas especiais e informações gerais
        sobre outros bens, serviços e eventos que oferecemos e que são
        semelhantes aos que você já comprou ou perguntou, a menos que você tenha
        optado por não receber tais informações.
      </p>
      <p>
        Para gerenciar suas solicitações: Para atender e gerenciar suas
        solicitações para nós.
      </p>
      <p>
        Para transferências comerciais: Podemos usar suas informações para
        avaliar ou realizar uma fusão, cisão, reestruturação, reorganização,
        dissolução ou outra venda ou transferência de alguns ou todos os nossos
        ativos, seja como uma empresa em funcionamento ou como parte de
        falência, liquidação ou procedimento semelhante, no qual Dados Pessoais
        mantidos por nós sobre nossos usuários do Serviço estão entre os ativos
        transferidos.
      </p>
      <p>
        Para outros fins: Podemos usar suas informações para outros fins, como
        análise de dados, identificação de tendências de uso, determinação da
        eficácia de nossas campanhas promocionais e para avaliar e melhorar
        nosso Serviço, produtos, serviços, marketing e sua experiência.
      </p>
      <h2>
        Podemos compartilhar suas informações pessoais nas seguintes situações:
      </h2>
      <p>
        Com Provedores de Serviço: Podemos compartilhar suas informações
        pessoais com Provedores de Serviço para monitorar e analisar o uso de
        nosso Serviço, para contatá-lo.
      </p>
      <p>
        Para transferências comerciais: Podemos compartilhar ou transferir suas
        informações pessoais em conexão com, ou durante negociações de, qualquer
        fusão, venda de ativos da Empresa, financiamento ou aquisição de todo ou
        parte de nosso negócio para outra empresa.
      </p>
      <p>
        Com Afiliadas: Podemos compartilhar suas informações com nossas
        afiliadas, caso em que exigiremos que essas afiliadas cumpram esta
        Política de Privacidade. As Afiliadas incluem nossa empresa controladora
        e quaisquer outras subsidiárias, parceiros de joint venture ou outras
        empresas que controlamos ou que estejam sob controle comum conosco.
      </p>
      <p>
        Com parceiros comerciais: Podemos compartilhar suas informações com
        nossos parceiros comerciais para oferecer a você determinados produtos,
        serviços ou promoções.
      </p>
      <p>
        Com outros usuários: quando você compartilha informações pessoais ou
        interage de outra forma nas áreas públicas com outros usuários, tais
        informações podem ser vistas por todos os usuários e podem ser
        distribuídas publicamente. Se você interagir com outros usuários ou se
        registrar através de um Serviço de Mídia Social de Terceiros, seus
        contatos no Serviço de Mídia Social de Terceiros poderão ver seu nome,
        perfil, fotos e descrição de sua atividade. Da mesma forma, outros
        usuários poderão visualizar descrições de sua atividade, comunicar-se
        com você e visualizar seu perfil.
      </p>
      <p>
        Com seu consentimento: podemos divulgar suas informações pessoais para
        qualquer outro fim com seu consentimento.
      </p>
      <h2>Retenção de Seus Dados Pessoais</h2>
      <p>
        A Empresa reterá seus Dados Pessoais apenas pelo tempo necessário para
        os fins estabelecidos nesta Política de Privacidade. Retiraremos e
        usaremos seus Dados Pessoais na medida do necessário para cumprir nossas
        obrigações legais (por exemplo, se formos obrigados a reter seus dados
        para cumprir leis aplicáveis), resolver disputas e fazer cumprir nossos
        acordos legais e políticas.
      </p>
      <p>
        A Empresa também reterá os Dados de Uso para fins de análise interna. Os
        Dados de Uso geralmente são retidos por um período de tempo mais curto,
        exceto quando esses dados são usados para fortalecer a segurança ou
        melhorar a funcionalidade de nosso Serviço, ou somos legalmente
        obrigados a reter esses dados por períodos de tempo mais longos.
      </p>
      <h2>Transferência de Seus Dados Pessoais</h2>
      <p>
        Suas informações, incluindo Dados Pessoais, são processadas nos
        escritórios operacionais da Empresa e em qualquer outro lugar onde as
        partes envolvidas no processamento estejam localizadas. Isso significa
        que essas informações podem ser transferidas para — e mantidas em —
        computadores localizados fora do seu estado, província, país ou outra
        jurisdição governamental onde as leis de proteção de dados podem ser
        diferentes daquelas da sua jurisdição.
      </p>
      <p>
        Seu consentimento a esta Política de Privacidade seguido por sua
        submissão de tais informações representa seu acordo com essa
        transferência.
      </p>
      <p>
        A Empresa tomará todas as medidas razoavelmente necessárias para
        garantir que seus dados sejam tratados com segurança e de acordo com
        esta Política de Privacidade e nenhuma transferência de seus Dados
        Pessoais será realizada para uma organização ou país, a menos que haja
        controles adequados em vigor, incluindo a segurança de seus dados e
        outras informações pessoais.
      </p>
      <h2>Excluir Seus Dados Pessoais</h2>
      <p>
        Você tem o direito de excluir ou solicitar que ajudemos a excluir os
        Dados Pessoais que coletamos sobre você.
      </p>
      <p>
        Nosso Serviço pode dar a você a capacidade de excluir certas informações
        sobre você de dentro do Serviço.
      </p>
      <p>
        Você pode atualizar, emendar ou excluir suas informações a qualquer
        momento fazendo login em sua Conta, se você tiver uma, e visitando a
        seção de configurações da conta que permite gerenciar suas informações
        pessoais. Você também pode entrar em contato conosco para solicitar
        acesso, correção ou exclusão de qualquer informação pessoal que você nos
        forneceu.
      </p>
      <p>
        Observe, no entanto, que podemos precisar reter algumas informações
        quando tivermos uma obrigação legal ou base legal para fazê-lo.
      </p>
      <h2>Divulgação de Seus Dados Pessoais</h2>
      <h2>Transações Comerciais</h2>
      <p>
        Se a Empresa estiver envolvida em uma fusão, aquisição ou venda de
        ativos, seus Dados Pessoais podem ser transferidos. Forneceremos aviso
        antes que seus Dados Pessoais sejam transferidos e se tornem sujeitos a
        uma Política de Privacidade diferente.
      </p>
      <h2>Aplicação da Lei</h2>
      <p>
        Em determinadas circunstâncias, a Empresa pode ser obrigada a divulgar
        seus Dados Pessoais se exigido por lei ou em resposta a solicitações
        válidas por autoridades públicas (por exemplo, um tribunal ou uma
        agência governamental).
      </p>
      <h2>Outros Requisitos Legais</h2>
      <p>
        A Empresa pode divulgar seus Dados Pessoais na crença de boa fé de que
        tal ação é necessária para:
      </p>
      <ul>
        <li>Cumprir uma obrigação legal</li>
        <li>Proteger e defender os direitos ou propriedade da Empresa</li>
        <li>
          Prevenir ou investigar possíveis irregularidades em conexão com o
          Serviço
        </li>
        <li>
          Proteger a segurança pessoal dos usuários do Serviço ou do público
        </li>
        <li>Proteger contra responsabilidade legal</li>
      </ul>
      <h2>Segurança de Seus Dados Pessoais</h2>
      <p>
        A segurança de seus Dados Pessoais é importante para nós, mas lembre-se
        de que nenhum método de transmissão pela Internet, ou método de
        armazenamento eletrônico é 100% seguro. Embora nos esforcemos para usar
        meios comercialmente aceitáveis para proteger seus Dados Pessoais, não
        podemos garantir sua segurança absoluta.
      </p>
      <h2>Privacidade de Crianças</h2>
      <p>
        Nosso Serviço não se dirige a ninguém com menos de 13 anos. Não
        coletamos conscientemente informações de identificação pessoal de
        ninguém com menos de 13 anos. Se você é pai ou responsável e está ciente
        de que seu filho nos forneceu Dados Pessoais, entre em contato conosco.
        Se ficarmos cientes de que coletamos Dados Pessoais de qualquer pessoa
        com menos de 13 anos sem verificação de consentimento dos pais,
        tomaremos medidas para remover essas informações de nossos servidores.
      </p>
      <p>
        Se precisarmos confiar no consentimento como base legal para processar
        suas informações e seu país exigir consentimento de um pai, poderemos
        exigir o consentimento de seus pais antes de coletar e usar essas
        informações.
      </p>
      <h2>Links para Outros Websites</h2>
      <p>
        Nosso Serviço pode conter links para outros websites que não são
        operados por nós. Se você clicar em um link de terceiros, será
        direcionado para o site desse terceiro. Recomendamos fortemente que você
        revise a Política de Privacidade de todos os sites que visitar.
      </p>
      <p>
        Não temos controle e não assumimos nenhuma responsabilidade pelo
        conteúdo, políticas de privacidade ou práticas de quaisquer sites ou
        serviços de terceiros.
      </p>
      <h2>Alterações a esta Política de Privacidade</h2>
      <p>
        Podemos atualizar nossa Política de Privacidade de tempos em tempos.
        Iremos notificá-lo sobre quaisquer alterações publicando a nova Política
        de Privacidade nesta página.
      </p>
      <p>
        Iremos informá-lo por e-mail e/ou por um aviso proeminente em nosso
        Serviço, antes da alteração se tornar efetiva e atualizaremos a data
        "Última atualização" no topo desta Política de Privacidade.
      </p>
      <p>
        Você é aconselhado a revisar periodicamente esta Política de Privacidade
        para quaisquer alterações. Alterações a esta Política de Privacidade são
        efetivas quando são publicadas nesta página.
      </p>
      <h2>Ofertas de Compra por Terceiros</h2>
      <p>
        Nosso site funciona como um marketplace onde os compradores podem fazer
        ofertas de compra de produtos relacionados a commodities. Por favor,
        esteja ciente de que não nos responsabilizamos pelas ofertas de compra
        feitas por terceiros nem pelos produtos ou transações resultantes dessas
        ofertas.
      </p>
      <p>
        Os compradores são exclusivamente responsáveis por avaliar a qualidade,
        autenticidade e adequação dos produtos oferecidos. Recomendamos que os
        compradores conduzam a devida diligência e tomem precauções ao realizar
        transações com terceiros.
      </p>
      <p>
        Nós não garantimos a precisão, integridade ou atualidade das informações
        fornecidas pelos compradores em suas ofertas de compra. Qualquer
        transação realizada é estritamente entre o comprador e o vendedor, e não
        temos controle sobre os termos ou condições dessas transações.
      </p>
      <p>
        Ao usar nosso Serviço para fazer ofertas de compra, você concorda em
        isentar a Empresa de qualquer responsabilidade decorrente de ou
        relacionada a tais transações com terceiros.
      </p>
      <h2>Contate-Nos</h2>
      <p>
        Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em
        contato conosco:
      </p>
      <p>Por e-mail: contato@nossaterra.tech</p>
    </div>
  );
};

export default PrivacyPolicyContent;
