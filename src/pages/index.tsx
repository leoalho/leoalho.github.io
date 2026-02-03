/* eslint-disable react/no-unescaped-entities */
export const config = {
  unstable_runtimeJS: false,
};

const Index = () => {
  return (
    <div>
      <div className="my-4">
        Hi, I am Leo Alho, a medical doctor, full stack developer and father of
        three. This is my developer homepage.
      </div>
      <div className="my-4">
        I am currently building:<br>
        - <a href={"https://octofy.ai"}>Octofy.ai</a>, a multi LLM AI chat application<br>
        - <a href={"https://polle.fi"}>Polle.fi</a>, a horse sales platform<br>
        - <a href={"https://openissue.io"}>Openissue.io</a>, public linear boards<br>
        - <a href={"https://tableport.gg"}>Tableport.gg</a>. a boardgame collection management and logistics platform.  
      </div>
      <div>
        Want to be in touch? Contact me by emailing{" "}
        <a href={"mailto:leoalho@proton.me"}>leoalho@proton.me</a>. I am especially interested in discussing projects related to health tech and the European sovereign cloud.
      </div>
    </div>
  );
};

export default Index;
