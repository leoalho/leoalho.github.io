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
        I am currently building <a href={"https://octofy.ai"}>Octofy.ai</a>, the
        best possible AI chat platform.
      </div>
      <div>
        Want to be in touch? Contact me by emailing{" "}
        <a href={"mailto:leo@alho.dev"}>leo@alho.dev</a>
      </div>
    </div>
  );
};

export default Index;
