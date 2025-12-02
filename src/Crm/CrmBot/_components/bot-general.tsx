import BotGeneralCard from "./BotCard";
import { BotType } from "./form/schema";
interface BotGeneralProps {
  bot: BotType;
  knowledgeCount: number;
}

function BotGeneral({ bot, knowledgeCount }: BotGeneralProps) {
  return (
    <div>
      <BotGeneralCard bot={bot} knowledgeCount={knowledgeCount} />
    </div>
  );
}

export default BotGeneral;
