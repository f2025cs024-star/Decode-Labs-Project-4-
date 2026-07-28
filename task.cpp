#include<iostream>
using namespace std;
class mango{
    private:
    int a;
    public:
    void set(int x){
        a=x;

    }
    void out(){
        cout <<"the value of a is " << a <<endl;
    };


    };
    class banana:public mango{
        public:
        void show(){
            cout <<"the value of a is " << a <<endl;
        }
    };

