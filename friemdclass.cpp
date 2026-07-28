#include<iostream>
using namespace std;
class car{
	int modelyear;
	string carmake;

	public:
	car(int modelyear, string carmake){
		this->modelyear=modelyear;
		this->carmake=carmake;
	};
		friend class F;
};
class F{
	public:


		void print(car c){
		cout << "the model of car is: "<<c.modelyear<<" and the brand name is: "<<c.carmake<<endl;
		
	};
};
int main(){
	car c1(2023,"toyta");
	F f1;
	f1.print(c1);
	return 0;
	
};
