import Seo from 'components/seo';
import Text from 'components/text';
import useSearchParam from 'hooks/useSearchParam';

const PairView: React.FC = () => {
  const userCode = useSearchParam('userCode');
  const verificationUri = useSearchParam('verificationUri');

  return (
    <>
      <Seo title={`${userCode} Авторизация`} />
      <div className="flex flex-col items-center justify-center w-screen h-screen text-center text-gray-200">
        <div>
          Подтвердите устройство перейдя по ссылке
          <br />
          <Text className="font-extrabold">{verificationUri}</Text>
          и введите код
          <br />
          <Text className="text-2xl font-extrabold text-blue-600">{userCode}</Text>
        </div>
        {process.env.REACT_APP_PAIR_ADDITIONAL_INFO && (
          <div dangerouslySetInnerHTML={{ __html: process.env.REACT_APP_PAIR_ADDITIONAL_INFO }} />
        )}
      </div>
    </>
  );
};

export default PairView;
