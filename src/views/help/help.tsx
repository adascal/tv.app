import Seo from 'components/seo';
import Title from 'components/title';

const HelpView: React.FC = () => {
  const title = 'Помощь';

  return (
    <>
      <Seo title={title} />
      <Title>{title}</Title>
      <div className="flex flex-col">
        {process.env.REACT_APP_HELP_ADDITIONAL_INFO && (
          <div dangerouslySetInnerHTML={{ __html: process.env.REACT_APP_HELP_ADDITIONAL_INFO }} />
        )}
      </div>
    </>
  );
};

export default HelpView;
