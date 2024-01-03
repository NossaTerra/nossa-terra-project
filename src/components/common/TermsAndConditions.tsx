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
          <ContentTermsAndConditions />
        </article>
      </DialogContent>
    </Dialog>
  );
}

const ContentTermsAndConditions = () => {
  return (
    <>
      <p>Última atualização: 01 de janeiro de 2024</p>

      <h2>Interpretação e Definições</h2>
      <h3>Interpretação</h3>
      <p>
        As palavras cuja inicial é maiúscula têm significados definidos nas
        seguintes condições. As seguintes definições terão o mesmo significado,
        independentemente de aparecerem no singular ou no plural.
      </p>
      <h3>Definições</h3>
      <p>Para os fins destes Termos e Condições:</p>
      <ul>
        <li>
          <strong>Afiliado</strong> significa uma entidade que controla, é
          controlada por, ou está sob controle comum com uma parte, onde
          "controle" significa a propriedade de 50% ou mais das ações, interesse
          patrimonial ou outros títulos com direito a voto para a eleição de
          diretores ou outra autoridade gerencial.
        </li>
      </ul>
      <h2>Rescisão</h2>
      <p>
        Podemos rescindir ou suspender imediatamente seu acesso, sem aviso
        prévio ou responsabilidade, por qualquer motivo, inclusive, sem
        limitação, se você violar estes Termos e Condições.
      </p>
      <p>
        Após a rescisão, seu direito de usar o Serviço cessará imediatamente.
      </p>
      <h2>Limitação de Responsabilidade</h2>
      <p>
        Não obstante quaisquer danos que você possa incorrer, a responsabilidade
        total da Empresa e de quaisquer de seus fornecedores sob qualquer
        disposição destes Termos e sua solução exclusiva para todos os itens
        anteriores serão limitadas ao valor realmente pago por você através do
        Serviço ou 100 USD, caso você não tenha comprado nada através do
        Serviço.
      </p>
      <p>
        Na extensão máxima permitida pela lei aplicável, em nenhum caso a
        Empresa ou seus fornecedores serão responsáveis por danos especiais,
        incidentais, indiretos ou consequentes de qualquer natureza (incluindo,
        mas não se limitando a, danos por perda de lucros, perda de dados ou
        outras informações, interrupção dos negócios, danos pessoais, perda de
        privacidade decorrente de ou de alguma forma relacionada ao uso ou
        incapacidade de usar o Serviço, software de terceiros e/ou hardware de
        terceiros usados com o Serviço, ou de outra forma relacionada a qualquer
        disposição destes Termos), mesmo que a Empresa ou qualquer fornecedor
        tenha sido avisado da possibilidade de tais danos e mesmo que o recurso
        falhe em seu propósito essencial. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Sed faucibus sem eget massa rhoncus, eu
        interdum libero feugiat. Nullam a metus id turpis imperdiet venenatis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus
        sem eget massa rhoncus, eu interdum libero feugiat. Nullam a metus id
        turpis imperdiet venenatis. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Sed faucibus sem eget massa rhoncus, eu interdum libero
        feugiat. Nullam a metus id turpis imperdiet venenatis. Lorem ipsum dolor
        sit amet, consectetur adipiscing elit. Sed faucibus sem eget massa
        rhoncus, eu interdum libero feugiat. Nullam a metus id turpis imperdiet
        venenatis.
      </p>

      <h2>Termos de Pagamento</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus
        sem eget massa rhoncus, eu interdum libero feugiat. Nullam a metus id
        turpis imperdiet venenatis. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Sed faucibus sem eget massa rhoncus, eu interdum libero
        feugiat. Nullam a metus id turpis imperdiet venenatis. Lorem ipsum dolor
        sit amet, consectetur adipiscing elit. Sed faucibus sem eget massa
        rhoncus, eu interdum libero feugiat. Nullam a metus id turpis imperdiet
        venenatis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
        faucibus sem eget massa rhoncus, eu interdum libero feugiat. Nullam a
        metus id turpis imperdiet venenatis. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Sed faucibus sem eget massa rhoncus, eu
        interdum libero feugiat. Nullam a metus id turpis imperdiet venenatis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus
        sem eget massa rhoncus, eu interdum libero feugiat. Nullam a metus id
        turpis imperdiet venenatis.
      </p>
      <p>
        Vestibulum vel neque in tortor blandit efficitur. Aenean tristique, leo
        eu luctus imperdiet, arcu elit bibendum neque, vel fermentum lectus elit
        nec sem. In hac habitasse platea dictumst. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Sed faucibus sem eget massa rhoncus, eu
        interdum libero feugiat. Nullam a metus id turpis imperdiet venenatis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus
        sem eget massa rhoncus, eu interdum libero feugiat. Nullam a metus id
        turpis imperdiet venenatis. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Sed faucibus sem eget massa rhoncus, eu interdum libero
        feugiat. Nullam a metus id turpis imperdiet venenatis. Lorem ipsum dolor
        sit amet, consectetur adipiscing elit. Sed faucibus sem eget massa
        rhoncus, eu interdum libero feugiat. Nullam a metus id turpis imperdiet
        venenatis.
      </p>
    </>
  );
};
