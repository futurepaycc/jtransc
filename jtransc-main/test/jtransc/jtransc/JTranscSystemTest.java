package jtransc.jtransc;

import com.jtransc.JTranscSystem;
import com.jtransc.annotation.JTranscNativeClass;
import com.jtransc.annotation.haxe.HaxeAddFilesTemplate;
import com.jtransc.annotation.haxe.HaxeMethodBody;

import java.util.Arrays;
import java.util.List;

@HaxeAddFilesTemplate("Simple.hx")
public class JTranscSystemTest {
	static public void main(String[] args) {
		List<String> classes = Arrays.asList(JTranscSystem.getAllClasses());
		System.out.println(classes.size() >= 2);
		System.out.println(classes.contains(JTranscSystemTest.class.getName()));
		System.out.println(classes.contains("com.donot.exists"));

		IntMap<Simple> intMap = IntMap.Utils.create();
		intMap.set(0, Simple.Utils.create());
		intMap.set(1, Simple.Utils.create());
		System.out.println(intMap.exists(0));
		System.out.println(intMap.exists(1));
		System.out.println(intMap.exists(2));
		intMap.remove(1);
		System.out.println(intMap.exists(1));
		intMap.get(0).flush();
	}

	@JTranscNativeClass("Simple.DynamicIntMap")
	static public class IntMap<T> {
		native public T get(int key);

		native public void set(int key, T value);

		native public void remove(int key);

		native public boolean exists(int key);

		static public class Utils {
			@HaxeMethodBody("return new haxe.ds.IntMap<Dynamic>();")
			native static public <T> IntMap<T> create();
		}
	}

	@JTranscNativeClass("Simple")
	static public class Simple {
		native public void flush();
		static public class Utils {
			@HaxeMethodBody("return new Simple();")
			native static public Simple create();
		}
	}
}
